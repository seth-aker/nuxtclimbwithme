import MessageGroup from "~/server/models/MessageGroup"
import User from "~/server/models/User";
import authorizeUser from "~/server/utils/authorizeUser";
import fetchUser from "~/server/utils/fetchUser";

export default defineEventHandler(async (event) => {
    const session = await authorizeUser(event);
    const user = await fetchUser(session.userInfo?.sub as string)
    readBodyProtection(event);
    const body = await readValidatedBody(event, validateMessageGroup);
    const chatMembers = await User.find({_id: [body.members]});
    const userConnections = user.connections?.map((connection) => connection.toString())
    chatMembers.forEach((chatMember) => {
        if(!userConnections?.includes(chatMember._id.toString())) {
            throw createError({
                statusCode: 403,
                statusMessage: "Forbidden",
                message: "Unable to create group with members that are not in your connections list."
            })
        }
    })
    
    await MessageGroup.create(body);
    setResponseStatus(event, 201, "Chat Group Created Successfully");
})
