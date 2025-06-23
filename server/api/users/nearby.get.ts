import mongoose from 'mongoose';
import * as z from 'zod'
import User, { IClimbingDiscipline, IUserPrivate, trimPrivateFields } from '~/server/models/User';
import authorizeUser from '~/server/utils/authorizeUser';
import { calculateCompatabilityScore, calculateDistance } from '~/server/utils/calculateScores';
import fetchUser from '~/server/utils/fetchUser';

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
const MAX_SEARCH_RADIUS_MILES = 500 // Maximum radius to expand to
const RADIUS_EXPANSION_MULTIPLIER = 2 // How much to multiply radius by each iteration
const MINIMUM_RESULTS = 5
export default defineEventHandler(async (event) => {
  const session = await authorizeUser(event);
  const currentUser = await fetchUser(session.userInfo?.sub as string)
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

  // Progressive search with expanding radius
  let currentRadius = searchParams.searchRadius ?? currentUser.preferences.searchRadius ?? DEFAULT_SEARCH_RADIUS_MILES;
  let searchResults: (mongoose.Document<unknown, {}, IUserPrivate> & IUserPrivate & Required<{
          _id: mongoose.Types.ObjectId;
      }> & {
          __v: number;
      })[] = [];

let scoredResults: {
        user: mongoose.Document<unknown, {}, IUserPrivate> & IUserPrivate & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        };
        score: number;
        distance: number;
      }[] = []
  // Keep expanding search radius until we find users or reach maximum radius
  while (searchResults.length < MINIMUM_RESULTS && currentRadius <= MAX_SEARCH_RADIUS_MILES) {
    console.log(currentRadius)
    searchResults = await User.find({
      _id: { $nin: [currentUser._id, ...currentUser.blocked]},
      'location.geoJSON': {
        $geoWithin: {
          $centerSphere: [
              currentUser.location.geoJSON.coordinates,
              currentRadius / EARTH_RADIUS_MILES
          ]
        }
      },
      registrationCompleted: true,
    }).select({
      _id: 1,
      location: 1,
      climbingExperience: 1,
      availability: 1,
      'preferences.openToClimbingTypes': 1,
      firstName: 1,
      lastName: 1,
      bio: 1,
      interests: 1,
      gearOwned: 1,
      communitiesJoined: 1,
      connections: 1,
      blocked: 1,
    }).limit((searchParams.limit ?? DEFAULT_LIMIT) * 2)

    // If no results found and we haven't reached max radius, expand the search
    console.log("Search results length: ", searchResults.length)
    scoredResults = searchResults.map(user => {
      const score = calculateCompatabilityScore(currentUser, user)
      const distance = calculateDistance(
        currentUser.location.geoJSON?.coordinates || [], 
        user.location.geoJSON?.coordinates || []
      );
      return {
        user,
        score,
        distance,
      }
    });
    scoredResults = scoredResults.filter(result => {
      return (result.distance !== -1 && !result.user.blocked.includes(currentUser._id))
    })
    scoredResults.sort((a,b) => b.score - a.score);
    console.log("current radius: ", currentRadius)
    if (scoredResults.length < MINIMUM_RESULTS && currentRadius < MAX_SEARCH_RADIUS_MILES) {
      currentRadius = Math.min(currentRadius * RADIUS_EXPANSION_MULTIPLIER, MAX_SEARCH_RADIUS_MILES);
    } else {
      break;
    }
  }
  return {
    users: scoredResults.map(({user, score, distance}) => ({
      ...trimPrivateFields(user),
      compatabilityScore: Math.round(score * 100) / 100,
      distance: Math.round(distance * 10) / 10
    })).slice(0, searchParams.limit ?? DEFAULT_LIMIT),
    searchRadius: currentRadius, // Return the actual search radius used
    expandedSearch: currentRadius > (searchParams.searchRadius ?? currentUser.preferences.searchRadius ?? DEFAULT_SEARCH_RADIUS_MILES)
  }
})
