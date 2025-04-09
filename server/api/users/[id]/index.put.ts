import User, { IUser } from "~/server/models/User";

export default defineEventHandler(async (event) => {
  // Authorize()
  readBodyProtection(event);
  const body: IUser = await readBody(event);
  const userId = getRouterParam(event, 'id');
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
  return user
})
