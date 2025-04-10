import { z } from "zod";
import { objectIdSchema } from "./validateObjectId";

export const messageSchema = z.object({
  groupId: objectIdSchema,
  senderId: objectIdSchema,
  content: z.string(),
  timestamp: z.coerce.date().optional(),
  readBy: z.array(objectIdSchema),
});

export default function validateMessage(chatMessage: unknown) {
 const result = messageSchema.safeParse(chatMessage);
 if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: result.error.message,
    });
  }
  return result.data;

}
