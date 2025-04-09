import User, { IUser } from "~/server/models/user";

export default defineEventHandler(async (event) => {
  // Authorize()
  readBodyProtection(event);
  const body: IUser = await readBody(event);
  const userId = getRouterParam(event, 'id');
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
