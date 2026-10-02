'use server'

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { paddyEntrySchema } from "@/lib/validators/paddySchema"
import { createPaddyEntry, updatePaddyEntry, deletePaddyEntry } from "@/lib/services/paddy/paddyService"

// create
export async function createPaddy(formData: FormData) {
  const parsed = paddyEntrySchema.safeParse({
    date: formData.get("date"),
    customerName: formData.get("customerName"),
    area: formData.get("area"),
    phoneNumber: formData.get("phoneNumber"),
    paddyType: formData.get("paddyType"),
    amountKg: formData.get("amountKg"),
    pricePerKg: formData.get("pricePerKg"),
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" }
  }

  await createPaddyEntry({
    ...parsed.data,
    date: new Date(parsed.data.date),
  })

  revalidatePath("/paddy")
  redirect("/paddy")
}

// update 
export async function updatePaddy(id: string, formData: FormData) {
  const parsed = paddyEntrySchema.safeParse({
    date: formData.get("date"),
    customerName: formData.get("customerName"),
    area: formData.get("area"),
    phoneNumber: formData.get("phoneNumber"),
    paddyType: formData.get("paddyType"),
    amountKg: formData.get("amountKg"),
    pricePerKg: formData.get("pricePerKg"),
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" }
  }

  await updatePaddyEntry(id, {
    ...parsed.data,
    date: new Date(parsed.data.date),
  })

  revalidatePath("/paddy")
  redirect("/paddy")
}

// delete
export async function removePaddy(id: string) {
  await deletePaddyEntry(id)
  revalidatePath("/paddy")
}