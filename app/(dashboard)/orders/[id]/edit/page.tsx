import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { getOrderById } from "@/lib/services/orders/orderService"
import { getAllPricing } from "@/lib/services/orders/pricingLookupService"
import { OrderForm } from "@/components/forms/OrderForm"

export default async function EditOrderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [order, pricing] = await Promise.all([getOrderById(id), getAllPricing()])

  if (!order) notFound()

  return (
    <div className="p-10">
      <Link
        href="/orders"
        className="inline-flex items-center gap-1.5 text-muted text-sm hover:text-ink transition-colors mb-6"
      >
        <ArrowLeft size={15} />
        Back to Rice Orders
      </Link>

      <h1 className="font-serif text-ink text-2xl mb-1">Edit Rice Order</h1>
      <p className="text-muted text-sm mb-8">Update this order's details and items.</p>
      <OrderForm pricing={pricing} initialData={order} />
    </div>
  )
}