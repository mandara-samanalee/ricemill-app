'use server'

import { revalidatePath } from "next/cache"
import { pricingUpdateSchema } from "@/lib/validators/pricingSchema"
import { upsertPrice, deletePrice } from "@/lib/services/pricing/pricingService"

export async function updatePrice(formData: FormData) {
  const parsed = pricingUpdateSchema.safeParse({
    riceType: formData.get("riceType"),
    packageType: formData.get("packageType"),
    price: formData.get("price"),
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" }
  }

  await upsertPrice(parsed.data.riceType, parsed.data.packageType, parsed.data.price)
  revalidatePath("/dashboard/pricing")
  return { success: true }
}

export async function removePrice(formData: FormData) {
  const riceType = formData.get("riceType") as string
  const packageType = formData.get("packageType") as string

  await deletePrice(riceType as any, packageType as any)
  revalidatePath("/pricing")
  return { success: true }
}