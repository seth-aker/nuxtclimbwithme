import { z } from "zod";
import ConnectionRequest from "~/server/models/ConnectionRequest";
const statusSchema = z.object({status: z.enum(['Pending', 'Accepted', 'Rejected', 'Withdrawn'])});

export default defineEventHandler(async(event) => {
    //authorize()
    const requestId = getRouterParam(event, 'requestId');
    const query = await getValidatedQuery(event, statusSchema.safeParse);
    const user = await findUserBySub(event);
    if(!query.success) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request"
        })
    }
    const request = await ConnectionRequest.findById(requestId).exec();
    if(!request) {
        throw createError({
            statusCode: 404,
            statusMessage: "Not Found",
            message: `Connection request with id: ${requestId} not found`
        })
    }
    if(request.receiverId.equals(user._id)) {
        request.status = query.data.status;
        await request.save();
        return request.toObject();
    } 
    if(request.senderId.equals(user._id) && query.data.status === 'Withdrawn') {
        request.status = query.data.status;
        await request.save();
        return request.toObject();
    }
    throw createError({
        statusCode: 403,
        statusMessage: "Forbidden",
        message: "You are not authorized to update this connection request" 
    })
})

