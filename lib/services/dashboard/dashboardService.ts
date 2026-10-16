import { prisma } from "@/lib/prisma/client"

export const DASHBOARD_MONTHS = 5

type Bucket = {
  key: string
  label: string
  paddyKg: number
  paddyCost: number
  riceKg: number
  riceRevenue: number
}

function monthKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}`
}

export async function getDashboardData(monthsBack = DASHBOARD_MONTHS) {
  const now = new Date()
  const windowStart = new Date(now.getFullYear(), now.getMonth() - (monthsBack - 1), 1)
  const windowEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

  const [trendOrders, trendPaddyEntries, allPaddyByType, allRiceTotals, allRiceByType] = await Promise.all([
    prisma.riceOrder.findMany({
      where: { date: { gte: windowStart, lte: windowEnd } },
    }),
    prisma.paddyEntry.findMany({
      where: { date: { gte: windowStart, lte: windowEnd } },
    }),
    prisma.paddyEntry.groupBy({
      by: ["paddyType"],
      _sum: { amountKg: true, totalPrice: true },
    }),
    prisma.riceOrder.aggregate({
      _sum: { totalSize: true, totalPrice: true, totalPackages: true },
    }),
    prisma.riceOrderItem.groupBy({
      by: ["riceType"],
      _sum: { totalSize: true, totalPrice: true },
    }),
  ])

  const buckets: Bucket[] = Array.from({ length: monthsBack }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (monthsBack - 1 - i), 1)
    return {
      key: monthKey(d),
      label: d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" }),
      paddyKg: 0,
      paddyCost: 0,
      riceKg: 0,
      riceRevenue: 0,
    }
  })
  const bucketByKey = new Map(buckets.map((b) => [b.key, b]))

  const paddyByType: Record<string, { kg: number; value: number }> = {
    DRY: { kg: 0, value: 0 },
    WET: { kg: 0, value: 0 },
  }
  const riceByType: Record<string, { kg: number; value: number }> = {
    TRIPLE: { kg: 0, value: 0 },
    DOUBLE: { kg: 0, value: 0 },
    SINGLE: { kg: 0, value: 0 },
  }
  for (const e of trendPaddyEntries) {
    const b = bucketByKey.get(monthKey(e.date))
    if (b) {
      b.paddyKg += e.amountKg
      b.paddyCost += e.totalPrice
    }
  }

  for (const o of trendOrders) {
    const b = bucketByKey.get(monthKey(o.date))
    if (b) {
      b.riceKg += o.totalSize
      b.riceRevenue += o.totalPrice
    }
  }

  for (const entry of allPaddyByType) {
    paddyByType[entry.paddyType] = {
      kg: entry._sum.amountKg ?? 0,
      value: entry._sum.totalPrice ?? 0,
    }
  }
  for (const entry of allRiceByType) {
    riceByType[entry.riceType] = {
      kg: entry._sum.totalSize ?? 0,
      value: entry._sum.totalPrice ?? 0,
    }
  }

  const trend = buckets.map((b) => ({
    month: b.label,
    paddyKg: b.paddyKg,
    paddyCost: b.paddyCost,
    riceKg: b.riceKg,
    riceRevenue: b.riceRevenue,
    net: b.riceRevenue - b.paddyCost,
  }))

  const paddyKg = allPaddyByType.reduce((sum, entry) => sum + (entry._sum.amountKg ?? 0), 0)
  const paddyCost = allPaddyByType.reduce((sum, entry) => sum + (entry._sum.totalPrice ?? 0), 0)
  const riceKg = allRiceTotals._sum.totalSize ?? 0
  const riceRevenue = allRiceTotals._sum.totalPrice ?? 0
  const ricePackages = allRiceTotals._sum.totalPackages ?? 0

  return {
    trend,
    totals: { paddyKg, paddyCost, riceKg, riceRevenue, ricePackages, net: riceRevenue - paddyCost },
    riceByType: Object.entries(riceByType).map(([type, v]) => ({ type, ...v })),
    paddyByType: Object.entries(paddyByType).map(([type, v]) => ({ type, ...v })),
  }
}