import User from "~/server/models/User";
import findUserBySub from "~/server/utils/findUserBySub";
export default defineEventHandler(async (event) => {
  const currentUser = await findUserBySub(event);
  const userId = getRouterParam(event, 'id');
  if (currentUser._id.toString() !== userId) {
      throw createError({
          statusCode: 403,
          statusMessage: "Forbidden",
          message: "You can only update your own user data"
      });
  }
  readBodyProtection(event);
  const body = await readValidatedBody(event, validateUser(true));
  if(!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
    })
  }
  const user = await User.findByIdAndUpdate(userId, body).exec();
  if(!user) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found",
      message: `User with id: ${userId} not found`
    })
  }
  return user.toObject();
 
})
