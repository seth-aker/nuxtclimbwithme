import mongoose, { ObjectId } from 'mongoose';
import * as z from 'zod'
import User, { IClimbingDiscipline, IUser } from '~/server/models/User';
import { calculateCompatabilityScore, calculateDistance } from '~/server/utils/calculateScores';

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
      searchRadius: z.number().optional().default(DEFAULT_SEARCH_RADIUS_MILES),
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

  let scoredUsers = searchResults.map(user => {
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
  scoredUsers = scoredUsers.filter(user => user.distance !== -1)
  scoredUsers.sort((a,b) => b.score - a.score);
  return scoredUsers.map(({user, score, distance}) => ({
    ...user.toObject(),
    compatabilityScore: Math.round(score * 100) / 100,
    disance: Math.round(distance * 10) / 10
  })).slice(0, searchParams.limit ?? DEFAULT_LIMIT)
})
