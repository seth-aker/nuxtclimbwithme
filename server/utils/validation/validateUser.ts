import { z } from "zod";
import { objectIdSchema } from "./validateObjectId";

export const zodUserSchema = z.object({
  userId: z.string(),
  username: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profilePicture: z.string().optional(),
  bio: z.string().optional(),
  location: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number()]), // [longitude, latitude]
    address: z.string().optional(),
  }).optional(),
  climbingExperience: z.object({
    boulderingGrade: z.string().optional(),
    leadClimbingGrade: z.string().optional(),
    topRopingGrade: z.string().optional(),
    yearsClimbing: z.number().optional(),
    disciplines: z
      .array(z.enum(['Bouldering', 'Sport', 'Trad', 'Aid', 'Ice', 'Alpine']))
      .optional(),
  }).optional(),
  availability: z.object({
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
  }).optional(),
  preferences: z.object({
    preferredClimbingTypes: z
      .array(z.enum(['Bouldering', 'Sport', 'Trad']))
      .optional(),
    preferredGrades: z
      .object({
        bouldering: z.string().optional(),
        lead: z.string().optional(),
      })
      .optional(),
    willingToTravel: z.boolean().optional(),
    searchRadius: z.number().optional(),
  }).optional(),
  interests: z.array(z.string()).optional(),
  gearOwned: z.array(z.string()).optional(),
  connections: z.array(objectIdSchema).optional(),
  requestsSent: z.array(objectIdSchema).optional(),
  requestsReceived: z.array(objectIdSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export default function validateUser(user: unknown) {
  const result = zodUserSchema.safeParse(user);
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: result.error.message,
    });
  }
  return result.data;
}
