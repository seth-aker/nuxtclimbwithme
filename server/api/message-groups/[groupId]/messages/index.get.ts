import ChatGroup from "~/server/models/MessageGroup";
import ChatMessage from "~/server/models/Message";
import findUserBySub from "~/server/utils/findUserBySub";

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
    let containsUser = false;
    for (let index = 0; index < chatGroup.members.length; index++) {
        const member = chatGroup.members[index];
        if(member._id.equals(user._id)){
            containsUser = true;
            break;
        }
    }
    if(!containsUser) {
        throw createError({
            statusCode: 403,
            statusMessage: "Forbidden",
            message: "User is not a part of the group"
        })
    }
    const groupMessages = await ChatMessage.find({groupId: chatGroup._id}).sort({timestamp: 'desc'}).limit(50).exec();
    const messages = groupMessages.map((messageDoc) => messageDoc.toObject());
    return messages
})
