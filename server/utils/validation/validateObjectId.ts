import { z } from 'zod';

// Regex for a 24-character hex string (MongoDB ObjectId)
export const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, 'Invalid ObjectId');

export default function validateObjectId(id: unknown) {
  const result = objectIdSchema.safeParse(id); 
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: result.error.message,
    });
  }
  return result.data;
}
