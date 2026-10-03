import { prisma } from "@/lib/prisma/client"
import { packageWeights } from "@/lib/utils/labels"
import type { RiceType, PackageType } from "@/lib/generated/prisma/client"

type OrderItemInput = {
  riceType: RiceType
  packageType: PackageType
  quantity: number
}

export async function createOrder(data: {
  date: Date
  customerName: string
  customerAddress?: string
  customerPhone?: string
  note?: string
  items: OrderItemInput[]
}) {
  // Look up current prices for every requested combination
  const pricingRows = await prisma.pricing.findMany({
    where: {
      OR: data.items.map((item) => ({
        riceType: item.riceType,
        packageType: item.packageType,
      })),
    },
  })

  const priceMap = new Map(
    pricingRows.map((p) => [`${p.riceType}_${p.packageType}`, p.price])
  )

  // Build item records with calculated totals, verifying every price exists
  const itemsToCreate = data.items.map((item) => {
    const price = priceMap.get(`${item.riceType}_${item.packageType}`)
    if (price === undefined) {
      throw new Error(
        `Price not set for ${item.riceType} / ${item.packageType}. Set it in Pricing first.`
      )
    }
    const weight = packageWeights[item.packageType]
    return {
      riceType: item.riceType,
      packageType: item.packageType,
      quantity: item.quantity,
      totalSize: item.quantity * weight,
      totalPrice: item.quantity * price,
    }
  })

  const totalPackages = itemsToCreate.reduce((sum, i) => sum + i.quantity, 0)
  const totalSize = itemsToCreate.reduce((sum, i) => sum + i.totalSize, 0)
  const totalPrice = itemsToCreate.reduce((sum, i) => sum + i.totalPrice, 0)

  // Create the order with items in a single transaction
  return prisma.riceOrder.create({
    data: {
      date: data.date,
      customerName: data.customerName,
      customerAddress: data.customerAddress || null,
      customerPhone: data.customerPhone || null,
      note: data.note || null,
      totalPackages,
      totalSize,
      totalPrice,
      items: {
        create: itemsToCreate,
      },
    },
    include: { items: true },
  })
}

// Get all orders with their items
export async function getAllOrders() {
  return prisma.riceOrder.findMany({
    orderBy: { updatedAt: "desc" },
    include: { items: true },
  })
}

// Get a single order by ID with its items
export async function getOrderById(id: string) {
  return prisma.riceOrder.findUnique({
    where: { id },
    include: { items: true },
  })
}

// Get Summary of all orders
export async function getOrderSummary() {
  const orders = await prisma.riceOrder.findMany()
  const totalValue = orders.reduce((sum, o) => sum + o.totalPrice, 0)
  const totalPackages = orders.reduce((sum, o) => sum + o.totalPackages, 0)
  const totalKg = orders.reduce((sum, o) => sum + o.totalSize, 0)
  return { totalValue, count: orders.length, totalPackages, totalKg }
}


// Update an existing order 
export async function updateOrder(
  id: string,
  data: {
    date: Date
    customerName: string
    customerAddress?: string
    customerPhone?: string
    note?: string
    items: OrderItemInput[]
  }
) {
  const pricingRows = await prisma.pricing.findMany({
    where: {
      OR: data.items.map((item) => ({
        riceType: item.riceType,
        packageType: item.packageType,
      })),
    },
  })

  const priceMap = new Map(
    pricingRows.map((p) => [`${p.riceType}_${p.packageType}`, p.price])
  )

  const itemsToCreate = data.items.map((item) => {
    const price = priceMap.get(`${item.riceType}_${item.packageType}`)
    if (price === undefined) {
      throw new Error(
        `Price not set for ${item.riceType} / ${item.packageType}. Set it in Pricing first.`
      )
    }
    const weight = packageWeights[item.packageType]
    return {
      riceType: item.riceType,
      packageType: item.packageType,
      quantity: item.quantity,
      totalSize: item.quantity * weight,
      totalPrice: item.quantity * price,
    }
  })

  const totalPackages = itemsToCreate.reduce((sum, i) => sum + i.quantity, 0)
  const totalSize = itemsToCreate.reduce((sum, i) => sum + i.totalSize, 0)
  const totalPrice = itemsToCreate.reduce((sum, i) => sum + i.totalPrice, 0)

  // Replace items: delete old ones, create the new set, update order totals — all in one transaction
  return prisma.$transaction(async (tx) => {
    await tx.riceOrderItem.deleteMany({ where: { orderId: id } })

    return tx.riceOrder.update({
      where: { id },
      data: {
        date: data.date,
        customerName: data.customerName,
        customerAddress: data.customerAddress || null,
        customerPhone: data.customerPhone || null,
        note: data.note || null,
        totalPackages,
        totalSize,
        totalPrice,
        items: {
          create: itemsToCreate,
        },
      },
      include: { items: true },
    })
  })
}

// Delete an order and its items
export async function deleteOrder(id: string) {
  return prisma.$transaction(async (tx) => {
    await tx.riceOrderItem.deleteMany({ where: { orderId: id } })
    await tx.riceOrder.delete({ where: { id } })
  })
}