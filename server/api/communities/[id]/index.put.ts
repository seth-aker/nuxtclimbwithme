import Community from "~/server/models/Community";
import authorizeUser from "~/server/utils/authorizeUser";
import fetchUser from "~/server/utils/fetchUser";
import readBodyProtection from "~/server/utils/readBodyProtection";
import { validateCommunity } from "~/server/utils/validation/validateCommunity";

export default defineEventHandler(async (event) => {
  const session = await authorizeUser(event);
  const user = await fetchUser(session.userInfo?.sub as string)
  readBodyProtection(event);
  const body = await readValidatedBody(event, validateCommunity);
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
      message: "You are not authorized to update this resource",
    });
  }
  community.overwrite(body);
  await community.save();
  return community;
});
