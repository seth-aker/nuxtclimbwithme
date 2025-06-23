import type {H3Event, EventHandlerRequest} from 'h3'
import { getUserSession } from 'nuxt-oidc-auth/runtime/server/utils/session.js'
export default async function(event: H3Event<EventHandlerRequest>) {
  const session = await getUserSession(event);
  if(!session || !session.userInfo) {
      throw createError({
          statusCode: 401,
          statusMessage: "Unauthorized",
          message: "User not logged in."
      })
  }
  return session;
}
