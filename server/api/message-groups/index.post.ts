import MessageGroup from "~/server/models/MessageGroup"
import User from "~/server/models/User";

export default defineEventHandler(async (event) => {
    //authorize()
    readBodyProtection(event);
    const user = await findUserBySub(event);
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
