import User from '~/server/models/user'
export default defineEventHandler(async (event) => {
    const userId = getRouterParam(event, 'id');
    const user = await User.findById(userId).exec();
    if(!user) {
        throw createError({
            statusCode: 404,
            statusMessage: "Not Found",
            message: `User with id: ${userId} not found`
        })
    }
    return user
})
   