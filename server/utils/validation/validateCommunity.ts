import { z } from "zod";
import { objectIdSchema } from "./validateObjectId";
import { zodCommunityLocationSchema } from "./validateCommunityLocation";

export const zodCommunitySchema = z.object({
    _id: objectIdSchema,
    location: zodCommunityLocationSchema,
    name: z.string(),
    description: z.string().optional(),
    ownerIds: z.array(objectIdSchema),
    memberIds: z.array(objectIdSchema),
    website: z.string().optional(),
    phone: z.string().optional(),
    climbingTypes: z.array(z.enum(['Bouldering', 'Sport', 'Top Rope', 'Trad', 'Aid', 'Ice', 'Alpine'])),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date()
})

export function validateCommunity(community: unknown) {
    try {
        const result = zodCommunitySchema.safeParse(community);
    
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