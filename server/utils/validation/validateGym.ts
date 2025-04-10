import { z } from "zod";
import { objectIdSchema } from "./validateObjectId";

export const gymSchema = z.object({
  name: z.string(),
  location: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number()]), // [longitude, latitude]
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
  }),
  owners: z.array(objectIdSchema),
  website: z.string().url().optional(),
  navigationUri: z.string().optional(),
  phone: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export default function validateGym(gym: unknown) {
  const result = gymSchema.safeParse(gym);
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: result.error.message,
    });
  }
  return result.data;
}
