import User from "~/server/models/User";

export default defineEventHandler(async (event) => {
  // Authorize()
  readBodyProtection(event);
  
  const body = await readValidatedBody(event, validateUser(true));
  const userId = getRouterParam(event, 'id');
  console.log("PUT request recieved")
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
