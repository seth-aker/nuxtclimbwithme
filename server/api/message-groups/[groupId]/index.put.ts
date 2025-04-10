import MessageGroup from "~/server/models/MessageGroup";
import findUserBySub from "~/server/utils/findUserBySub";


export default defineEventHandler(async (event) => {
    //authorize()
    const user = await findUserBySub(event);
    readBodyProtection(event);
    const body = await readValidatedBody(event, validateMessageGroup);
    const groupId = getRouterParam(event, 'groupId');
    if(!groupId) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "[API] Missing group id"
        })
    }
    const messageGroup = await MessageGroup.findOne({_id: groupId}).exec();
    if(!messageGroup) {
        throw createError({
            statusCode: 404,
            statusMessage: "Not found",
            message: `Chat group with id: ${groupId} not found.`
        })
    }
    let isOwner = false;
    for (let index = 0; index < messageGroup.owners.length; index++) {
        const owner = messageGroup.owners[index];
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
    await messageGroup.overwrite(body).save();
   
})
