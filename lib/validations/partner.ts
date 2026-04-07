import { z } from "zod"

export const createPartnerSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  logo: z.string()
    .refine((val) => !val || val.startsWith("http") || val.startsWith("/"), {
      message: "Le logo doit être une URL valide ou un chemin relatif",
    })
    .optional()
    .nullable(),
  contact: z.string().optional().nullable(),
  commissionRate: z.number().min(0).max(100).default(0),
  isActive: z.boolean().default(true),
})

export const updatePartnerSchema = createPartnerSchema.partial().extend({
  id: z.string(),
})

export type CreatePartnerInput = z.infer<typeof createPartnerSchema>
export type UpdatePartnerInput = z.infer<typeof updatePartnerSchema>
