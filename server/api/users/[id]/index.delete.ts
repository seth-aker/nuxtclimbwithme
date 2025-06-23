import User from "~/server/models/User";
import authorizeUser from "~/server/utils/authorizeUser";
import fetchUser from "~/server/utils/fetchUser";
export default defineEventHandler(async (event) => {
  const session = await authorizeUser(event);
  const currentUser = await fetchUser(session.userInfo?.sub as string)
  const userId = getRouterParam(event, 'id');
  if (currentUser._id.toString() !== userId) {
      throw createError({
          statusCode: 403,
          statusMessage: "Forbidden",
          message: "You can only delete your own user data"
      });
  }
  if(!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
    })
  }
  const user = await User.findByIdAndDelete(userId);
  if(!user) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found",
      message: `User with id: ${userId} not found`
    })
  }
  return user
})
