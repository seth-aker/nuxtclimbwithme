import { z } from "zod";
import {meetupInvitationSchema} from "./validateMeetupInvitation";
import {objectIdSchema} from "./validateObjectId";


export const meetupSchema = z.object({
  organizerId: objectIdSchema,
  title: z.string(),
  description: z.string().optional(),
  location: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number()]), // [longitude, latitude]
    address: z.string().optional(),
    gymId: z.string().optional(),
    gymName: z.string().optional(),
  }),
  dateTime: z.coerce.date(),
  capacity: z.number().optional(),
  participants: z.array(objectIdSchema).optional(), // user IDs as strings
  invitations: z.array(meetupInvitationSchema).optional(),
  inviteOnly: z.boolean().optional(),
  requiredExperience: z
    .object({
      boulderingGrade: z.string().optional(),
      leadClimbingGrade: z.string().optional(),
    })
    .optional(),
  gearNeeded: z.array(z.string()).optional(),
  status: z.enum(['Open', 'Full', 'Cancelled', 'Completed']).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});
export default function validateMeetup(meetup: unknown) {
  const result = meetupSchema.safeParse(meetup);
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: result.error.message,
    });
  }
  return result.data;
}
