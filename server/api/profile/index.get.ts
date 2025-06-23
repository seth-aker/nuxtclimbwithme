import User from "~/server/models/User";
import authorizeUser from "~/server/utils/authorizeUser";
export default defineEventHandler(async (event) => {
    const session = await authorizeUser(event)
    if(!session.userInfo) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "User not logged in."
        })
    }
    try {
        const user = await User.findOne({authId: session.userInfo.sub}).exec();
        if(!user) {
            throw createError({
                statusCode: 404,
                statusMessage: "Not Found",
                message: `User with sub: ${session.userInfo.sub} does not exist in the database`
            })
        }
        return user.toObject();
    } catch (e: any) {
        console.error(e)
        if(!('statusCode' in e) || e.statusCode !== 404) {
            throw e
        }
        const newUser = await User.create({
            authId: session.userInfo.sub,
            email: session.userInfo.email,
            phoneNumber: session.userInfo.phoneNumber,
            firstName: session.userInfo.givenName,
            lastName: session.userInfo.familyName,
            profilePicture: session.userInfo.picture,
        })
        return newUser.toObject();
    }
    
})
