import Gym from "~/server/models/Gym"
import authorizeUser from "~/server/utils/authorizeUser";
import fetchUser from "~/server/utils/fetchUser";

export default defineEventHandler(async (event) => {
  await authorizeUser(event);
  const gymId = getRouterParam(event, 'gymId');
  const gym = await Gym.findById(gymId).exec();
  return gym
})
