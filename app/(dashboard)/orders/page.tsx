import Link from "next/link"
import { Plus } from "lucide-react"
import { getAllOrders, getOrderSummary } from "@/lib/services/orders/orderService"
import { OrderTable } from "@/components/tables/OrderTable"
import { StatCard } from "@/components/shared/StatCard"

export default async function OrdersPage() {
  const [orders, summary] = await Promise.all([getAllOrders(), getOrderSummary()])

  return (
    <div className="p-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-serif text-ink text-2xl mb-1">Rice Orders</h1>
          <p className="text-muted text-sm">All recorded rice sales.</p>
        </div>
        <Link
          href="/orders/new"
          className="flex items-center gap-2 bg-paddy text-paper px-4 py-2.5 rounded-md hover:opacity-90 transition-opacity text-sm font-medium"
        >
          <Plus size={16} />
          New Order
        </Link>
      </div>

<div className="grid grid-cols-4 gap-4 mb-8">
  <StatCard label="Total Orders" value={summary.count.toString()} />
  <StatCard label="Packages Sold" value={summary.totalPackages.toString()} />
  <StatCard label="Rice Sold in KG" value={`${summary.totalKg.toFixed(2)} kg`} />
  <StatCard label="Total Revenue" value={`Rs. ${summary.totalValue.toFixed(2)}`} />
</div>

      <OrderTable orders={orders} />
    </div>
  )
}