import { z } from "zod"

export const createBlogPostSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  slug: z.string().min(1, "Le slug est requis"),
  excerpt: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  image: z
    .string()
    .refine((val) => !val || val.startsWith("http") || val.startsWith("/"), {
      message: "L'image doit être une URL valide ou un chemin relatif",
    })
    .optional()
    .nullable(),
  publishedAt: z.union([z.string().datetime(), z.string()]).optional().nullable(),
  isActive: z.boolean().default(true),
})

export const updateBlogPostSchema = createBlogPostSchema.partial().extend({
  id: z.string(),
})

export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>
