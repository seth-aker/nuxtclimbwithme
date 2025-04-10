import mongoose from "mongoose";
import ChatGroup from "~/server/models/MessageGroup";
import ChatMessage from "~/server/models/Message";
import findUserBySub from "~/server/utils/findUserBySub";

export default defineEventHandler(async (event) => {
    //authorize();
    const user = await findUserBySub(event);
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
    let isOwner = false;
    for (let index = 0; index < chatGroup.owners.length; index++) {
        const owner = chatGroup.owners[index];
        if(owner._id.equals(user._id)){
            isOwner = true;
            break;
        }
    }
    if(!isOwner) {
        throw createError({
            statusCode: 403,
            statusMessage: "Forbidden",
            message: "User is not a part of the group"
        })
    }
    const db = event.context.mongoose as mongoose.Connection;
    const session = await db.startSession()
    await session.withTransaction(async () => {
        await ChatMessage.deleteMany({groupId: groupId}).exec();
        const groupResult = await ChatGroup.deleteOne({_id: groupId}).exec();
        if(groupResult.deletedCount === 0) {
            throw new Error("Chat group was not deleted")
        }
        // TODO: check to make sure that all messages are deleted
    })
    await session.endSession();
    setResponseStatus(event, 204, "No Content")
})
