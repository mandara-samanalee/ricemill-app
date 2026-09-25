import { z } from "zod"

export const pricingUpdateSchema = z.object({
  riceType: z.enum(["TRIPLE", "DOUBLE", "SINGLE"]),
  packageType: z.enum(["KG_5", "KG_10", "KG_25", "KG_50"]),
  price: z.coerce.number().min(0, "Price cannot be negative"),
})