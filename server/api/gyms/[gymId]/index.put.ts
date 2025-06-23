import Gym from "~/server/models/Gym";
import authorizeUser from "~/server/utils/authorizeUser";
import fetchUser from "~/server/utils/fetchUser";

export default defineEventHandler(async (event) => {
  const session = await authorizeUser(event);
  const user = await fetchUser(session.userInfo?.sub as string)
  const body = await readValidatedBody(event, validateGym);
  const gymId = getRouterParam(event, 'gymId');
  const gym = await Gym.findById(gymId).exec();
  if(!gym) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found",
      message: `Gym with id: ${gymId} not found`
    })
  }
  let isOwner = false;
  for (let index = 0; index < gym.owners.length; index++) {
    const owner = gym.owners[index];
    if(owner._id.equals(user._id)){
      isOwner = true;
      break;
    }
  }
  if(!isOwner) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
      message: "You are not authorized to update this resource"
    })
  }

  gym.overwrite(body).save();
  return gym;
});
