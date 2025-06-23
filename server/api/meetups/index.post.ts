import Meetup from "~/server/models/Meetup";
import authorizeUser from "~/server/utils/authorizeUser";
import fetchUser from "~/server/utils/fetchUser";
import validateMeetup from "~/server/utils/validation/validateMeetup";


export default defineEventHandler(async (event) => {
  const session = await authorizeUser(event);
  const user = await fetchUser(session.userInfo?.sub as string)
  readBodyProtection(event);
  const body = await readValidatedBody(event, validateMeetup);
  const meetup = await Meetup.create({...body, organizerId: user._id});
  return meetup
})
