import { z } from "zod"

export const paddyEntrySchema = z.object({
  date: z.string().min(1, "Date is required"),
  customerName: z.string().min(1, "Customer name is required"),
  area: z.string().min(1, "Area is required"),
  phoneNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{10}$/.test(val), {
      message: "Phone number must be exactly 10 digits",
    }),
  paddyType: z.enum(["DRY", "WET"]),
  amountKg: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  pricePerKg: z.coerce.number().min(0, "Price cannot be negative"),
})

export type PaddyEntryInput = z.infer<typeof paddyEntrySchema>