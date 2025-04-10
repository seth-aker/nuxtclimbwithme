import { z } from "zod";
import { objectIdSchema } from "./validateObjectId";

export const chatGroupSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  picture: z.string().optional(),
  members: z.array(objectIdSchema),
  owners: z.array(objectIdSchema),
  isPrivate: z.boolean(),
  lastMessageAt: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export default function validateChatGroup(chatGroup: unknown) {
  const result = chatGroupSchema.safeParse(chatGroup);
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: result.error.message,
    });
  }
  return result.data;
}
