import { z } from "zod"
import { PromotionType, DiscountType } from "@prisma/client"

export const createPromotionSchema = z.object({
  type: z.nativeEnum(PromotionType),
  name: z.string().min(1, "Le nom est requis"),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  discountType: z.nativeEnum(DiscountType),
  discountValue: z.number().min(0),
  productIds: z.array(z.string()).optional().default([]),
  categoryIds: z.array(z.string()).optional().default([]),
  isActive: z.boolean().default(true),
})

export const updatePromotionSchema = createPromotionSchema.partial().extend({
  id: z.string(),
})

export type CreatePromotionInput = z.infer<typeof createPromotionSchema>
export type UpdatePromotionInput = z.infer<typeof updatePromotionSchema>
