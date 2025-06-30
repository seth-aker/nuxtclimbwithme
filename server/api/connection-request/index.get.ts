import ConnectionRequest from "~/server/models/ConnectionRequest";
import authorizeUser from "~/server/utils/authorizeUser";
import fetchUser from "~/server/utils/fetchUser";

export default defineEventHandler(async (event) => {
    const session = await authorizeUser(event);
    const user = await fetchUser(session.userInfo?.sub as string)
    const _sentRequests = await ConnectionRequest.find({senderId: user._id}).exec();
    const _receivedRequests = await ConnectionRequest.find({receiverId: user._id}).exec();

    const sentRequests = _sentRequests.map((req) => req.toObject());
    const receivedRequests = _receivedRequests.map((req) => req.toObject());
    return {connectionRequests: [...sentRequests, ...receivedRequests]}
    
})
