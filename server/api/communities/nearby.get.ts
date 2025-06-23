import Community, { ICommunity } from "~/server/models/Community";
import * as z from 'zod'
import authorizeUser from "~/server/utils/authorizeUser";
import fetchUser from "~/server/utils/fetchUser";
const EARTH_RADIUS_MILES = 3963.2;
const DEFAULT_SEARCH_RADIUS_MILES = 50;
const MAX_SEARCH_RADUIS = 500;
const SEARCH_RADIUS_MULTIPLIER = 2;
export default defineEventHandler(async (event) => {
    const session = await authorizeUser(event);
    const user = await fetchUser(session.userInfo?.sub as string)
    if(!user.location.geoJSON) {
        throw createError({
            statusCode: 400,
            statusMessage: "Missing user coordinates"
        })
    }
    const searchRadiusQuery = await getValidatedQuery(event, (query) => {
        const result = z.object({searchRadius: z.number().optional()}).safeParse(query);
        if (!result.success) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Search Radius must be number of miles'
            })
        }
        return result.data
    })
    let searchRadius = searchRadiusQuery.searchRadius ?? DEFAULT_SEARCH_RADIUS_MILES;
    let result = [] as ICommunity[]
    while(result.length < 5 && searchRadius <= MAX_SEARCH_RADUIS) {
        result = await Community.find({
            'location.geoJSON': {
                $geoWithin: {
                    $centerSphere: [
                        user.location.geoJSON.coordinates,
                        searchRadius / EARTH_RADIUS_MILES
                    ]
                }
            }
        })
        if(result.length < 5) {
            searchRadius = searchRadius * SEARCH_RADIUS_MULTIPLIER
        }
    }
    return result;

})

