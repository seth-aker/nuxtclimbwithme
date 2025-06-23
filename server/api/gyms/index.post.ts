import Gym from "~/server/models/Gym";
import authorizeUser from "~/server/utils/authorizeUser";
import fetchUser from "~/server/utils/fetchUser";

export default defineEventHandler(async (event) => {
  const session = await authorizeUser(event)
  const user = await fetchUser(session.userInfo?.sub as string)
  readBodyProtection(event);
  const body = await readValidatedBody(event, validateGym);
  const gym = await Gym.create({...body, owners: [...body.owners, user._id]});
  return gym
})
