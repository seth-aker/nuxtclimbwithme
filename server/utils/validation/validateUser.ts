import { object, z } from "zod";
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
      name: z.enum(['Bouldering', 'Sport','Top Rope', 'Trad', 'Aid', 'Ice', 'Alpine']),
      grade: z.string().optional(),
      yearsExperience: z.number().positive().optional(),
      certified: z.boolean().optional()
    })).optional() 
  }).optional(),
  availability: z.object({
    monday: z.array(z.enum(['Morning', 'Afternoon', 'Evening'])),
    tuesday: z.array(z.enum(['Morning', 'Afternoon', 'Evening'])),
    wednesday: z.array(z.enum(['Morning', 'Afternoon', 'Evening'])),
    thursday: z.array(z.enum(['Morning', 'Afternoon', 'Evening'])),
    friday: z.array(z.enum(['Morning', 'Afternoon', 'Evening'])),
    saturday: z.array(z.enum(['Morning', 'Afternoon', 'Evening'])),
    sunday: z.array(z.enum(['Morning', 'Afternoon', 'Evening'])),
  }).optional(),
  preferences: z.object({
    colorTheme: z.enum(['system', 'light', 'dark']),
    openToClimbingTypes: z
      .array(z.object({
          name: z.enum(['Bouldering', 'Sport', 'Top Rope', 'Trad', 'Aid', 'Ice', 'Alpine']),
          preferredGrade: z.string().optional(),
          certified: z.boolean().optional()
      })).optional(),
    searchRadius: z.number().nonnegative().optional(),
  }).optional(),
  interests: z.array(z.string()).optional(),
  gearOwned: z.array(z.string()).optional(),
  connections: z.array(objectIdSchema),
  requestsSent: z.array(objectIdSchema),
  requestsReceived: z.array(objectIdSchema),
  blocked: z.array(objectIdSchema),
  registrationCompleted: z.boolean().default(false),
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
