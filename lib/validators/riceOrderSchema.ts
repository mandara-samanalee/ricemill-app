import { z } from "zod"

export const orderItemSchema = z.object({
  riceType: z.enum(["TRIPLE", "DOUBLE", "SINGLE"]),
  packageType: z.enum(["KG_5", "KG_10", "KG_25", "KG_50"]),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
})

export const orderSchema = z.object({
  date: z.string().min(1, "Date is required"),
  customerName: z.string().min(1, "Customer name is required"),
  customerAddress: z.string().optional(),
  customerPhone: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{10}$/.test(val), {
      message: "Phone number must be exactly 10 digits",
    }),
  note: z.string().optional(),
  items: z.array(orderItemSchema).min(1, "Add at least one item to the order"),
})

export type OrderInput = z.infer<typeof orderSchema>
export type OrderItemInput = z.infer<typeof orderItemSchema>