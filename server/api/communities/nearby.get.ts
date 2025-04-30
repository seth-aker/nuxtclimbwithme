import Community from "~/server/models/Community";
import * as z from 'zod'
const EARTH_RADIUS_MILES = 3963.2;
const DEFAULT_SEARCH_RADIUS_MILES = 50
export default defineEventHandler(async (event) => {
    const user = await findUserBySub(event);
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
    const searchRadius = searchRadiusQuery.searchRadius ?? DEFAULT_SEARCH_RADIUS_MILES;

    const result = await Community.find({
        'location.geoJSON': {
            $geoWithin: {
                $centerSphere: [
                    user.location.geoJSON.coordinates,
                    searchRadius / EARTH_RADIUS_MILES
                ]
            }
        }
    })
    const result_2 = await Community.where('location.geoJSON').within({ centerSphere: user.location.geoJSON.coordinates, radius: searchRadius / EARTH_RADIUS_MILES}).exec();

})

