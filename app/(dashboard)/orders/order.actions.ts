'use server'

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { orderSchema } from "@/lib/validators/riceOrderSchema"
import { createOrder, updateOrder, deleteOrder } from "@/lib/services/orders/orderService"

// Create a new rice order from form data, validate it, and redirect to the orders page
export async function createRiceOrder(formData: FormData) {
  const itemsRaw = formData.get("items")?.toString() ?? "[]"

  const parsed = orderSchema.safeParse({
    date: formData.get("date"),
    customerName: formData.get("customerName"),
    customerAddress: formData.get("customerAddress"),
    customerPhone: formData.get("customerPhone"),
    note: formData.get("note"),
    items: JSON.parse(itemsRaw),
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" }
  }

  try {
    await createOrder({
      ...parsed.data,
      date: new Date(parsed.data.date),
    })
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create order",
    }
  }

  revalidatePath("/orders")
  redirect("/orders")
}

// Update an existing rice order from form data, validate it, and redirect to the orders page
export async function updateRiceOrder(id: string, formData: FormData) {
  const itemsRaw = formData.get("items")?.toString() ?? "[]"

  const parsed = orderSchema.safeParse({
    date: formData.get("date"),
    customerName: formData.get("customerName"),
    customerAddress: formData.get("customerAddress"),
    customerPhone: formData.get("customerPhone"),
    note: formData.get("note"),
    items: JSON.parse(itemsRaw),
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" }
  }

  try {
    await updateOrder(id, {
      ...parsed.data,
      date: new Date(parsed.data.date),
    })
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update order",
    }
  }

  revalidatePath("/orders")
  redirect("/orders")
}

// Delete an existing rice order by ID 
export async function removeOrder(id: string) {
  await deleteOrder(id)
  revalidatePath("/orders")
}