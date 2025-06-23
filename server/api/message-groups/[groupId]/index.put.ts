import MessageGroup from "~/server/models/MessageGroup";
import authorizeUser from "~/server/utils/authorizeUser";
import fetchUser from "~/server/utils/fetchUser";

export default defineEventHandler(async (event) => {
    //authorize()
    const session = await authorizeUser(event);
    const user = await fetchUser(session.userInfo?.sub as string)
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
