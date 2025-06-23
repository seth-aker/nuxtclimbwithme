import ChatGroup from "~/server/models/MessageGroup";
import ChatMessage from "~/server/models/Message";
import findUserBySub from "~/server/utils/fetchUser";
import userIsGroupMember from "~/server/utils/userIsGroupMember";
import authorizeUser from "~/server/utils/authorizeUser";
import fetchUser from "~/server/utils/fetchUser";

export default defineEventHandler(async(event) => {
    const session = await authorizeUser(event);
    const user = await fetchUser(session.userInfo?.sub as string)
    readBodyProtection(event)
    const body = await readValidatedBody(event, validateMessage);
    const groupId = getRouterParam(event, 'groupId');
    if(!groupId) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad request"
        })
    }
    const chatGroup = await ChatGroup.findById(groupId).exec();
    if(!chatGroup) {
        throw createError({
            statusCode: 404,
            statusMessage: "Not found"
        })
    }
    if(!userIsGroupMember(user, chatGroup)) {
        throw createError({
            statusCode: 403,
            statusMessage: "Forbidden"
        })
    }
    const newMessage = await ChatMessage.create(body);
    // Send something to ws server
    
    
})
