import ConnectionRequest from "~/server/models/ConnectionRequest";
import User from "~/server/models/User";
import authorizeUser from "~/server/utils/authorizeUser";
import fetchUser from "~/server/utils/fetchUser";

export default defineEventHandler(async(event) => {
    const session = await authorizeUser(event);
    const user = await fetchUser(session.userInfo?.sub as string)
    const receiverId = getRouterParam(event, 'receiverId');
    const receiver = await User.findById(receiverId).exec();
    if(!receiver) {
        throw createError({
            statusCode: 404,
            statusMessage: "Not Found",
            message: `User with id: ${receiverId} not found`
        })
    }
    if(receiver._id.equals(user._id)) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "You cannot send a connection request to yourself"
        })
    }
    if(user.requestsSent.includes(receiver._id)) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "You have already sent a connection request to this user"
        })
    }
    if(user.requestsReceived.includes(receiver._id)) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "You have already received a connection request from this user"
        })
    }
    if(user.connections.includes(receiver._id)) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "You are already connected to this user"
        })
    }
    if(user.blocked.includes(receiver._id)) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "You have blocked this user"
        })
    }
    if(receiver.blocked.includes(user._id)) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "This user has blocked you"
        })
    }

    const newRequest = await ConnectionRequest.create({senderId: user._id, receiverId: receiver._id});
    user.requestsSent.push(newRequest._id);
    receiver.requestsReceived.push(newRequest._id);
    await user.save();
    await receiver.save();
    return newRequest.toObject();
})
