import Community from "~/server/models/Community";
import findUserBySub from "~/server/utils/findUserBySub";

export default defineEventHandler(async (event) => {
  const user = await findUserBySub(event);
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
  for (let index = 0; index < community.ownerIds.length; index++) {
    const ownerId = community.ownerIds[index];
    if (ownerId.equals(user._id)) {
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
