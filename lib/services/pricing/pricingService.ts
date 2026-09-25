import { prisma } from "@/lib/prisma/client"
import type { RiceType, PackageType } from "@/lib/generated/prisma/client"

const RICE_TYPES: RiceType[] = ["TRIPLE", "DOUBLE", "SINGLE"]
const PACKAGE_TYPES: PackageType[] = ["KG_5", "KG_10", "KG_25", "KG_50"]

export async function getPricingGrid() {
  const existing = await prisma.pricing.findMany()
  const map = new Map(existing.map((p) => [`${p.riceType}_${p.packageType}`, p.price]))

  return RICE_TYPES.map((riceType) => ({
    riceType,
    packages: PACKAGE_TYPES.map((packageType) => ({
      packageType,
      price: map.get(`${riceType}_${packageType}`) ?? null,
    })),
  }))
}

export async function upsertPrice(riceType: RiceType, packageType: PackageType, price: number) {
  return prisma.pricing.upsert({
    where: { riceType_packageType: { riceType, packageType } },
    update: { price },
    create: { riceType, packageType, price },
  })
}

export async function deletePrice(riceType: RiceType, packageType: PackageType) {
  await prisma.pricing.deleteMany({
    where: { riceType, packageType },
  })
}