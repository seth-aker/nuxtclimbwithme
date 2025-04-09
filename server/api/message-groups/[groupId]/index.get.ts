import ChatGroup from "~/server/models/ChatGroup";
import ChatMessage from "~/server/models/ChatMessage";
import findUserBySub from "~/server/utils/findUserBySub";
import userIsGroupMember from "~/server/utils/userIsGroupMember";

export default defineEventHandler(async (event) => {
    // authorize()
    const groupId = getRouterParam(event, 'groupId');
    if(!groupId) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "[API] Missing group id"
        })
    }
    const user = await findUserBySub(event);
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