import Community from "~/server/models/Community";
import authorizeUser from "~/server/utils/authorizeUser";
import fetchUser from "~/server/utils/fetchUser";

export default defineEventHandler(async (event) => {
  const session = await authorizeUser(event);
  const user = await fetchUser(session.userInfo?.sub as string)
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
    });
  }
  const community = await Community.findById(id).exec();
  if (!community) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found",
      message: `Community with id: ${id} not found`,
    });
  }
  let isOwner = false;
  for(const id in community.ownerIds) {
    if(user._id.equals(id)) {
      isOwner = true;
      break;
    }
  }
  if (!isOwner) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
      message: "You are not authorized to delete this resource",
    });
  }
  await community.deleteOne();
  return { message: "Community deleted successfully" };
});
