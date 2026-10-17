import { prisma } from "@/lib/prisma/client"
import type { PaddyType } from "@/lib/generated/prisma/client"

// create new entry
export async function createPaddyEntry(data: {
  date: Date
  customerName: string
  area: string
  phoneNumber?: string
  paddyType: PaddyType
  amountKg: number
  pricePerKg: number
}) {
  const totalPrice = data.amountKg * data.pricePerKg

  return prisma.paddyEntry.create({
    data: {
      ...data,
      phoneNumber: data.phoneNumber || null,
      totalPrice,
    },
  })
}

// get all paddy entries
export async function getAllPaddyEntries() {
  return prisma.paddyEntry.findMany({
    orderBy: { updatedAt: "desc" },
  })
}

// get paddy summary
export async function getPaddySummary() {
  const entries = await prisma.paddyEntry.findMany()
  const totalKg = entries.reduce((sum, e) => sum + e.amountKg, 0)
  const totalValue = entries.reduce((sum, e) => sum + e.totalPrice, 0)
  return { totalKg, totalValue, count: entries.length }
}

// get paddy by Id
export async function getPaddyEntryById(id: string) {
  return prisma.paddyEntry.findUnique({ where: { id } })
}

// update paddy record
export async function updatePaddyEntry(
  id: string,
  data: {
    date: Date
    customerName: string
    area: string
    phoneNumber?: string
    paddyType: PaddyType
    amountKg: number
    pricePerKg: number
  }
) {
  const totalPrice = data.amountKg * data.pricePerKg

  return prisma.paddyEntry.update({
    where: { id },
    data: {
      ...data,
      phoneNumber: data.phoneNumber || null,
      totalPrice,
    },
  })
}

// delete paddy record
export async function deletePaddyEntry(id: string) {
  return prisma.paddyEntry.delete({ where: { id } })
}