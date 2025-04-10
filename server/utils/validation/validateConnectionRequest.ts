import { z } from "zod";
import { objectIdSchema } from "./validateObjectId";

export const connectionRequestSchema = z.object({
  senderId: objectIdSchema,
  receiverId: objectIdSchema,
  status: z
    .enum(['Pending', 'Accepted', 'Rejected', 'Withdrawn'])
    .optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export default function validateConnectionRequest(connectionRequest: unknown) {
  const result = connectionRequestSchema.safeParse(connectionRequest);
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: result.error.message,
    });
  }
  return result.data;
}
