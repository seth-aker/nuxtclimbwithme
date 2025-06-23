import User from '~/server/models/User'
import authorizeUser from '~/server/utils/authorizeUser';
import fetchUser from '~/server/utils/fetchUser';
export default defineEventHandler(async (event) => {
    const session = await authorizeUser(event);
    const currentUser = await fetchUser(session.userInfo?.sub as string)
    const userId = getRouterParam(event, 'id');
    if(!userId) {
        throw createError({
          statusCode: 400,
          statusMessage: "Bad Request",
        })
      }

    if (currentUser._id.toString() === userId) {
        return currentUser;
    }
    // Get public information only
    const user = await User.findById(userId).select({
        _id: 1,
        firstName: 1,
        lastName: 1,
        profilePicture: 1,
        climbingExperience: 1,
        availability: 1,
        'preferences.openToClimbingTypes': 1,
        interests: 1,
        gearOwned: 1
    });
    if(!user) {
        throw createError({
            statusCode: 404,
            statusMessage: "Not Found",
            message: `User with id: ${userId} not found`
        })
    }
    return user
})
