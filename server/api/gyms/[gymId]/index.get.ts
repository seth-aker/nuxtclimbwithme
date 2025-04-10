import Gym from "~/server/models/Gym"

export default defineEventHandler(async (event) => {
  // authorize()
  const gymId = getRouterParam(event, 'gymId');
  const gym = await Gym.findById(gymId).exec();
  return gym
})
