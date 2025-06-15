import mongoose, { ObjectId } from 'mongoose';
import * as z from 'zod'
import { daysOfWeek } from '~/assets/lists/daysOfWeek';
import User, { IClimbingDiscipline, IUser } from '~/server/models/User';

interface IUserSearchQuery {
  searchRadius?: number, //in miles
  climbingType?: IClimbingDiscipline['name'][],
  limit?: number,
  includeConnections?: boolean,
  belayCertified?: boolean
}
const EARTH_RADIUS_MILES = 3963.2;
const DEFAULT_SEARCH_RADIUS_MILES = 50
const DEFAULT_LIMIT = 20
const SCORING_WEIGHTS = {
  DISTANCE: 0.3,
  CLIMBING_DISCIPLINES: 0.25,
  INTERESTS: 0.2,
  AVAILABILITY: 0.15,
  COMMUNITIES_JOINED_OVERLAP: 0.1
}

export default defineEventHandler(async (event) => {
  const currentUser = await findUserBySub(event);
  if(!currentUser.location.geoJSON) {
    throw createError({
      statusCode: 400,
      statusMessage: "Location not set, cannot search by location."
    })
  }
  const searchParams: IUserSearchQuery = await getValidatedQuery(event, (data) => {
    const res = z.object({
      searchRadius: z.number().optional().default(50),
      climbingType: z.array(z.enum(['Bouldering','Sport', 'Top Rope', 'Trad', 'Aid', 'Ice', 'Alpine'])).optional(),
      limit: z.number().optional(),
      availability: z.array(z.string()).optional(),
      includeConnections: z.boolean().optional(),
      belayCertified: z.boolean().optional()
    }).safeParse(data)
    if(!res.success) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid query parameters"
      })
    }
    return res.data
  });

  const searchResults = await User.find({
    _id: { $nin: [currentUser._id, ...currentUser.blocked]},
    'location.geoJSON': {
      $geoWithin: {
        $centerSphere: [
            currentUser.location.geoJSON.coordinates,
            (searchParams.searchRadius ?? currentUser.preferences.searchRadius ?? DEFAULT_SEARCH_RADIUS_MILES) / EARTH_RADIUS_MILES
        ]
      }
    },
    registrationCompleted: true,
  }).select({
    authId: -1, 
    email: -1, 
    phoneNumber: -1, 
    'preferences.colorTheme': -1,
    'preferences.searchRadius': -1,
    requestsSent: -1,
    requestsReceived: -1,
    blocked: -1,
    createdAt: -1,
    updatedAt: -1
  }).limit((searchParams.limit ?? DEFAULT_LIMIT) * 2)

  const scoredUsers = searchResults.map(user => {
    const score = calculateCompatabilityScore(currentUser, user)
    const distance = calculateDistance(
      currentUser.location.geoJSON?.coordinates || [], 
      user.location.geoJSON?.coordinates || []
    );
    return {
      user,
      score,
      distance
    }
  });
  
  scoredUsers.sort((a,b) => b.score - a.score);
  
  return scoredUsers.map(({user, score, distance}) => ({
    ...user.toObject(),
    compatabilityScore: Math.round(score * 100) / 100,
    disance: Math.round(distance * 10) / 10
  })).slice(0, searchParams.limit ?? DEFAULT_LIMIT)
})


export function calculateCompatabilityScore(currentUser: IUser, otherUser: IUser, searchRadius?: number): number {
  let totalScore = 0;

  const distance = calculateDistance(currentUser.location.geoJSON?.coordinates || [], otherUser.location.geoJSON?.coordinates || [])
  const maxDistance = searchRadius ?? currentUser.preferences.searchRadius ?? DEFAULT_SEARCH_RADIUS_MILES;
  const distanceScore = Math.max(0, (maxDistance - distance) / maxDistance);

  totalScore += distanceScore * SCORING_WEIGHTS.DISTANCE;

  const climbingScore = calculateClimbingCompatability(
    currentUser.climbingExperience.disciplines, 
    otherUser.climbingExperience.disciplines, 
    currentUser.preferences.openToClimbingTypes
  );
  totalScore += climbingScore * SCORING_WEIGHTS.CLIMBING_DISCIPLINES;

  const interestsScore = calculateInterestsCompatability(
    currentUser.interests || [],
    otherUser.interests || []
  );
  totalScore += interestsScore * SCORING_WEIGHTS.INTERESTS

  const availabilityScore = calculateAvailabilityCompatability(currentUser.availability, otherUser.availability);

  totalScore += availabilityScore * SCORING_WEIGHTS.AVAILABILITY

  const communitiesOverlapScore = calculateCommunitiesOverlapScore(currentUser.communitiesJoined, otherUser.communitiesJoined)
  totalScore += communitiesOverlapScore * SCORING_WEIGHTS.COMMUNITIES_JOINED_OVERLAP

  return totalScore;
}

export function calculateDistance(coords1: number[], coords2: number[]): number {
  const [lon1, lat1] = coords1;
  const [lon2, lat2] = coords2;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 + Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_MILES * c;
}

export function calculateClimbingCompatability(
  userDisciplines: IClimbingDiscipline[],
  otherUserDisciplines: IClimbingDiscipline[],
  userPreferences: IUser['preferences']['openToClimbingTypes']
): number {
  if(!userDisciplines.length || !otherUserDisciplines.length) return 0

  const userTypes = new Set(userDisciplines.map(d => d.name));
  const otherUserTypes = new Set(userDisciplines.map(d => d.name));
  const preferredTypes = userPreferences ? new Set(userPreferences.map(d => d.name)): undefined;
  
  const commonTypes = [...userTypes].filter(type => otherUserTypes.has(type));
  if (commonTypes.length === 0) return 0;

  const preferredCommonTypes = commonTypes.filter(type => preferredTypes?.has(type));

  let certifiedBonus = 0;
  let preferredGradeBonus = 0;
  // add bonuses for user preferences in common typs
  commonTypes.forEach((commonType) => {
    const otherUserDiscipline = otherUserDisciplines.find(discipline => discipline.name === commonType)
    if(otherUserDiscipline?.certified) {
      certifiedBonus += 0.1
    }
    if(preferredCommonTypes.includes(commonType)) {
      const userPreference = userPreferences?.find(preference => commonType === preference.name);
      if(userPreference?.preferredGrade === otherUserDiscipline?.grade) {
        preferredGradeBonus += 0.2
      }
    }
  })
 
  const baseScore = commonTypes.length / Math.max(userTypes.size, otherUserTypes.size);
  const preferenceBonus = preferredCommonTypes.length * 0.2;

  return Math.min(1, baseScore + preferenceBonus + certifiedBonus + preferredGradeBonus)
}

export function calculateInterestsCompatability(userInterests: string[], otherUserInterests: string[]): number {
  if(!userInterests.length || !otherUserInterests.length) return 0
  
  const _userInterests = userInterests.map(i => i.toLowerCase())
  const otherUserSet = new Set(otherUserInterests.map(i => i.toLowerCase()))
  
  const commonInterests = _userInterests.filter(interest => otherUserSet.has(interest));

  return commonInterests.length / Math.max(_userInterests.length, otherUserSet.size);
}

export function calculateAvailabilityCompatability(userAvailability: IUser['availability'], otherUserAvailability: IUser['availability']): number {
  let totalOverlap = 0;
  let totalSlots = 0;

  daysOfWeek.forEach(day => {
    const userSlots = new Set(userAvailability[day] || []);
    const otherUserSlots = new Set(otherUserAvailability[day] || []);

    if(userSlots.size > 0 && otherUserSlots.size > 0) {
      const overlap = [...userSlots].filter(slot => otherUserSlots.has(slot));
      totalOverlap += overlap.length
      totalSlots += Math.max(userSlots.size, otherUserSlots.size);
    }
  })

  return totalSlots > 0 ? totalOverlap / totalSlots : 0;
}

export function calculateCommunitiesOverlapScore(userCommunitiesJoined: mongoose.Types.ObjectId[], otherUserCommunitiesJoined: mongoose.Types.ObjectId[]): number {
  if(!userCommunitiesJoined.length || !otherUserCommunitiesJoined.length) return 0

  let communitiesOverlapCount = 0;
  userCommunitiesJoined.forEach(community => {
    if(otherUserCommunitiesJoined.includes(community)) {
      communitiesOverlapCount++;
    }
  })

  return communitiesOverlapCount > 0 ? Math.min(1, communitiesOverlapCount * 0.2) : 0
}
