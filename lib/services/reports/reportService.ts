import { prisma } from "@/lib/prisma/client"

export async function getPaddyEntriesInRange(start: Date, end: Date) {
  return prisma.paddyEntry.findMany({
    where: { date: { gte: start, lte: end } },
    orderBy: { date: "desc" },
  })
}

export async function getPaddyReportSummary(start: Date, end: Date) {
  const entries = await getPaddyEntriesInRange(start, end)
  return {
    totalEntries: entries.length,
    totalKg: entries.reduce((sum, e) => sum + e.amountKg, 0),
    totalValue: entries.reduce((sum, e) => sum + e.totalPrice, 0),
  }
}

export async function getOrdersInRange(start: Date, end: Date) {
  return prisma.riceOrder.findMany({
    where: { date: { gte: start, lte: end } },
    orderBy: { date: "desc" },
    include: { items: true },
  })
}

export async function getOrderReportSummary(start: Date, end: Date) {
  const orders = await getOrdersInRange(start, end)
  return {
    totalOrders: orders.length,
    totalPackages: orders.reduce((sum, o) => sum + o.totalPackages, 0),
    totalKg: orders.reduce((sum, o) => sum + o.totalSize, 0),
    totalValue: orders.reduce((sum, o) => sum + o.totalPrice, 0),
  }
}