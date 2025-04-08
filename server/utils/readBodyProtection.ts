import type {H3Event, EventHandlerRequest} from 'h3'
export default function(event: H3Event<EventHandlerRequest>) {
    const contentType = getHeader(event, 'content-type');
    if(!contentType || contentType !== 'application/json') {
        console.log('[ReadBodyProection]: Error, incorrect or missing content-type header');
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: "content-type: application/json header required"
        })
    }
}