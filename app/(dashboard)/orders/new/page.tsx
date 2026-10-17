import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { OrderForm } from "@/components/forms/OrderForm"
import { getAllPricing } from "@/lib/services/orders/pricingLookupService"

export default async function NewOrderPage() {
  const pricing = await getAllPricing()

  return (
    <div className="p-10">
      <Link
        href="/orders"
        className="inline-flex items-center gap-1.5 text-muted text-sm hover:text-ink transition-colors mb-6"
      >
        <ArrowLeft size={15} />
        Back to Rice Orders
      </Link>

      <h1 className="font-serif text-ink text-2xl mb-1">New Rice Order</h1>
      <p className="text-muted text-sm mb-8">Record a rice sale with one or more items.</p>
      <OrderForm pricing={pricing} />
    </div>
  )
}