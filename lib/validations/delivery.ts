import { z } from "zod"

export const createDeliveryZoneSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  price: z.number().min(0, "Le prix doit être positif"),
  isActive: z.boolean().default(true),
})

export const updateDeliveryZoneSchema = createDeliveryZoneSchema.partial().extend({
  id: z.string(),
})

export type CreateDeliveryZoneInput = z.infer<typeof createDeliveryZoneSchema>
export type UpdateDeliveryZoneInput = z.infer<typeof updateDeliveryZoneSchema>
