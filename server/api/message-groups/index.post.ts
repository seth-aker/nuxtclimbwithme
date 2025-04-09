import ChatGroup, { IChatGroup } from "~/server/models/ChatGroup"
import User, { IUser } from "~/server/models/User";
import findUserBySub from "~/server/utils/findUserBySub";

export default defineEventHandler(async (event) => {
    //authorize()
    readBodyProtection(event);
    const user = await findUserBySub(event);
    const body: IChatGroup = await readBody(event);
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
    
    await ChatGroup.create(body);
    setResponseStatus(event, 201, "Chat Group Created Successfully");
})