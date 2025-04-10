import { getUserSession } from "nuxt-oidc-auth/runtime/server/utils/session.js";
import User from "~/server/models/User";
import type {H3Error} from 'h3'
export default defineEventHandler(async (event) => {
    // authoriz()
    const session = await getUserSession(event);
    if(!session.userInfo) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "User not logged in."
        })
    }
    try {
        const user = await User.findOne({userId: session.userInfo.sub}).exec();
        if(!user) {
            throw createError({
                statusCode: 404,
                statusMessage: "Not Found",
                message: `User with sub: ${session.userInfo.sub} does not exist in the database`
            })
        }
        return user.toObject();
    } catch (e: H3Error | any) {
        if(!e?.statusCode || e.statusCode !== 404) {
            throw e
        }
        const newUser = await User.create({
            userId: session.userInfo.sub,
            email: session.userInfo.email,
            phoneNumber: session.userInfo.phoneNumber,
            firstName: session.userInfo.givenName,
            lastName: session.userInfo.familyName,
            profilePicture: session.userInfo.picture,
        })
        return newUser.toObject();
    }
    
})