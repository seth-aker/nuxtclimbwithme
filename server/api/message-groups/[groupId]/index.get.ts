import ChatGroup from "~/server/models/MessageGroup";
import userIsGroupMember from "~/server/utils/userIsGroupMember";
import authorizeUser from "~/server/utils/authorizeUser";
import fetchUser from "~/server/utils/fetchUser";

export default defineEventHandler(async (event) => {
    const session = await authorizeUser(event);
    const user = await fetchUser(session.userInfo?.sub as string)
    const groupId = getRouterParam(event, 'groupId');
    if(!groupId) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "[API] Missing group id"
        })
    }
    const chatGroup = await ChatGroup.findById(groupId).exec();
    if(!chatGroup) {
        throw createError({
            statusCode: 404,
            statusMessage: "Not found",
            message: `Chat group with id: ${groupId} not found.`
        })
    }
    
    if(!userIsGroupMember(user, chatGroup)) {
        throw createError({
            statusCode: 403,
            statusMessage: "Forbidden",
            message: "User is not a part of the group"
        })
    }
    return ({chatGroup: chatGroup.toObject()})
})
