import User from '../models/User';
export default async function(sub: string | undefined) {
    if(!sub) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized"
        })
    }
    const user = await User.findOne({authId: sub}).exec();
    if(!user) {
        throw createError({
            statusCode: 404,
            statusMessage: "Not Found",
            message: `User with sub: ${sub} does not exist in the database`
        })
    }
    return user;
}
