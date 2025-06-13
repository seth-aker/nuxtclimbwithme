import Gym from "~/server/models/Gym";
import findUserBySub from "~/server/utils/findUserBySub";

export default defineEventHandler(async (event) => {
  await findUserBySub(event);
  readBodyProtection(event);
  const body = await readValidatedBody(event, validateGym);
  const gym = await Gym.create({...body});
  return gym
})
