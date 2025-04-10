import { z } from "zod";
import {objectIdSchema} from "./validateObjectId";

export const meetupInvitationSchema = z.object({
  senderId: objectIdSchema,
  receiverId: objectIdSchema,
  meetupId: objectIdSchema,
  status: z
    .enum(['Pending', 'Accepted', 'Rejected', 'Withdrawn', 'Maybe'])
    .optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export default function validateMeetupInvitation(invitation: unknown) {
  const result = meetupInvitationSchema.safeParse(invitation);
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: result.error.message,
    });
  }
  return result.data;
}
