import Meetup from "~/server/models/Meetup";
import validateMeetup from "~/server/utils/validation/validateMeetup";


export default defineEventHandler(async (event) => {
  // authorize()
  readBodyProtection(event);
  const body = await readValidatedBody(event, validateMeetup);
  const user = await findUserBySub(event);
  const meetup = await Meetup.create({...body, organizerId: user._id});
  return meetup
})
