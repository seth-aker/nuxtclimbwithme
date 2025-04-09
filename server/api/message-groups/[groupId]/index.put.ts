import ChatGroup from "~/server/models/ChatGroup";
import findUserBySub from "~/server/utils/findUserBySub";

export default defineEventHandler(async (event) => {
    //authorize()
    const user = await findUserBySub(event);
    readBodyProtection(event);
    const body = await readBody(event);
    const groupId = getRouterParam(event, 'groupId');
    if(!groupId) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "[API] Missing group id"
        })
    }
    const chatGroup = await ChatGroup.findOne({_id: groupId}).exec();
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
            message: "User does not have permission to edit the group"
        }) 
    } 
    await chatGroup.overwrite(body).save();
   
})