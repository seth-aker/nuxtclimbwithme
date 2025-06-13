import Community from "~/server/models/Community";
import findUserBySub from "~/server/utils/findUserBySub";
import readBodyProtection from "~/server/utils/readBodyProtection";
import { validateCommunity } from "~/server/utils/validation/validateCommunity";

export default defineEventHandler(async (event) => {
  const user = await findUserBySub(event);
  readBodyProtection(event);
  const body = await readValidatedBody(event, validateCommunity);
  const community = await Community.create({
    ...body,
    ownerIds: [user._id]
  });
  return community;
});
