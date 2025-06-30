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
  const community = await Community.create({
    ...body,
    ownerIds: [...body.ownerIds, user._id]
  });
  return community;
});
