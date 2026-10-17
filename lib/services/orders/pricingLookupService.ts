import { prisma } from "@/lib/prisma/client"

export async function getAllPricing() {
  return prisma.pricing.findMany()
}