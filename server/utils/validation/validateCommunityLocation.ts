import { z } from "zod";
import { objectIdSchema } from "./validateObjectId";

export const zodCommunityLocationSchema = z.object({
  _id: objectIdSchema,
  name: z.string(),
  description: z.string().optional(),
  geoJSON: z.object({
    type: z.string().refine((string) => string === 'Point'),
    coordinates: z.tuple([z.number(), z.number()])
  }).optional(),
  address: z.string().optional(),
  hours: z.object({
    openAtTime: z.string(),
    openDurationHours: z.string()
  }).optional(),
  navigationLinks: z.array(z.object({
    uri: z.string(),
    description: z.string().optional()
  })),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
})

export default function validateCommunityLocation(location: unknown) {
  try {
    const result = zodCommunityLocationSchema.safeParse(location);
    if (!result.success) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: result.error.message,
      });
    }
    return result.data;
  } catch (e) {
    console.log(e) 
    throw e
  }
}