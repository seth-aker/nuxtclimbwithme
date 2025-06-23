import ConnectionRequest from "~/server/models/ConnectionRequest";
import findUserBySub from "~/server/utils/fetchUser"

export default defineEventHandler(async (event) => {
    // authorize();
    const user = await findUserBySub(event);
    const _sentRequests = await ConnectionRequest.find({senderId: user._id}).exec();
    const _receivedRequests = await ConnectionRequest.find({receiverId: user._id}).exec();

    const sentRequests = _sentRequests.map((req) => req.toObject());
    const receivedRequests = _receivedRequests.map((req) => req.toObject());
    return {connectionRequests: [...sentRequests, ...receivedRequests]}
    
})
