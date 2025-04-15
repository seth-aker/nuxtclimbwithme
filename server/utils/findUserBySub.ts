import type {H3Event, EventHandlerRequest} from 'h3'
import { getUserSession } from 'nuxt-oidc-auth/runtime/server/utils/session.js'
import User from '../models/User';
export default async function(event: H3Event<EventHandlerRequest>) {
    const session = await getUserSession(event);
    if(!session.userInfo) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "User not logged in."
        })
    }
    const user = await User.findOne({authId: session.userInfo.sub}).exec();
    if(!user) {
        throw createError({
            statusCode: 404,
            statusMessage: "Not Found",
            message: `User with sub: ${session.userInfo.sub} does not exist in the database`
        })
    }
    return user;
}