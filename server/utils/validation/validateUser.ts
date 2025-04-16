import { z } from "zod";
import { objectIdSchema } from "./validateObjectId";

export const zodUserSchema = z.object({
  authId: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profilePicture: z.string().optional(),
  bio: z.string().optional(),
  location: z.object({
    coordinates: z.object({
      latitude: z.number(),
      longitude: z.number()
    }).optional(),
    geohash: z.string().optional(),
    address: z.string().optional(),
  }).optional(),
  climbingExperience: z.object({
    disciplines: z.array(z.object({
      name: z.array(z.enum(['Bouldering', 'Sport','Top Rope', 'Trad', 'Aid', 'Ice', 'Alpine'])),
      grade: z.string().optional(),
      yearsExperience: z.number().positive().optional(),
      certified: z.boolean().optional()
    })).optional() 
  }).optional(),
  availability: z.array(z.object({
    weekdays: z
      .array(
        z.enum([
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ])
      )
      .optional(),
    timeOfDay: z
      .array(z.enum(['Morning', 'Afternoon', 'Evening']))
      .optional(),
  }).optional()),
  preferences: z.object({
    colorTheme: z.enum(['System', 'Light', 'Dark']).optional(),
    preferredClimbingTypes: z
      .array(z.object({
          name: z.enum(['Bouldering', 'Sport', 'Top Rope', 'Trad', 'Aid', 'Ice', 'Alpine']),
          preferredGrade: z.string().optional(),
          certified: z.boolean().optional()
      })).optional(),
    searchRadius: z.number().nonnegative().optional(),
  }).optional(),
  interests: z.array(z.string()).optional(),
  gearOwned: z.array(z.string()).optional(),
  connections: z.array(objectIdSchema).optional(),
  requestsSent: z.array(objectIdSchema).optional(),
  requestsReceived: z.array(objectIdSchema).optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export default function validateUser(user: unknown) {
  try {
    const result = zodUserSchema.safeParse(user);

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
