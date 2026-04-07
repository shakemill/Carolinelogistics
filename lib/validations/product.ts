import { z } from "zod"

export const createProductSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  slug: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  price: z.number().min(0, "Le prix doit être positif"),
  dimensions: z.string().optional().nullable(),
  weight: z.number().optional().nullable(),
  stock: z.number().int().min(0).default(0),
  tva: z.number().min(0).max(100).optional().nullable(),
  images: z.array(z.string()).default([]),
  categoryId: z.string().optional().nullable(),
  isPartner: z.boolean().default(false),
  partnerId: z.string().optional().nullable(),
  externalLink: z.string()
    .refine((val) => !val || val.startsWith("http") || val.startsWith("/"), {
      message: "Le lien externe doit être une URL valide",
    })
    .optional()
    .nullable(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
})

export const updateProductSchema = createProductSchema.partial().extend({
  id: z.string(),
})

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
