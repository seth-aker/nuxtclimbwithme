import ConnectionRequest from "~/server/models/ConnectionRequest";
import findUserBySub from "~/server/utils/findUserBySub";

export default defineEventHandler(async(event) => {
    // authorize()
    const receiverId = getRouterParam(event, 'receiverId');
    const user = await findUserBySub(event);
    
    await ConnectionRequest.create({senderId: user._id, receiverId});
})