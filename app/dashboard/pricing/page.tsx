import { getPricingGrid } from "@/lib/services/pricing/pricingService"
import { PricingTable } from "@/components/pricing/PricingTable"

export default async function PricingPage() {
  const grid = await getPricingGrid()

  return (
    <div className="p-18 max-w-4xl">
      <h1 className="font-serif text-ink text-2xl mb-1">Pricing</h1>
      <p className="text-muted text-sm mb-8">
        Set the price per package for each rice type and size. Click a price to edit it.
      </p>
      <PricingTable grid={grid} />
    </div>
  )
}