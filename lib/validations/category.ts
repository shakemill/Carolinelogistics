import { z } from "zod"

export const createCategorySchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  slug: z.string().min(1, "Le slug est requis"),
  parentId: z.string().optional().nullable(),
  image: z
    .string()
    .optional()
    .nullable()
    .refine((val) => {
      if (!val || val === "") return true
      // Accepter les URLs http/https ou les chemins relatifs commençant par /
      return val.startsWith("http") || val.startsWith("/")
    }, {
      message: "L'image doit être une URL valide ou un chemin relatif",
    }),
  description: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
})

export const updateCategorySchema = createCategorySchema.partial().extend({
  id: z.string(),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
