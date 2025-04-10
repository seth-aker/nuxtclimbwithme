import Gym from "~/server/models/Gym";

export default defineEventHandler(async (event) => {
  // authorize()
  readBodyProtection(event);
  const body = await readValidatedBody(event, validateGym);
  const gym = await Gym.create({...body});
  return gym
})
