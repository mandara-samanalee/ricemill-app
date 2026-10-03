'use client'

import { useState, useTransition } from "react"
import { Plus, X } from "lucide-react"
import { createRiceOrder, updateRiceOrder } from "@/app/(dashboard)/orders/order.actions"
import { riceTypeLabels, packageTypeLabels, packageWeights } from "@/lib/utils/labels"

type PricingRow = { riceType: string; packageType: string; price: number }

type OrderItem = {
  riceType: string
  packageType: string
  quantity: number
  totalSize: number
  totalPrice: number
}

type ExistingOrder = {
  id: string
  date: Date | string
  customerName: string
  customerAddress: string | null
  customerPhone: string | null
  note: string | null
  items: { riceType: string; packageType: string; quantity: number; totalSize: number; totalPrice: number }[]
}

const riceTypes = ["TRIPLE", "DOUBLE", "SINGLE"]
const packageTypes = ["KG_5", "KG_10", "KG_25", "KG_50"]

export function OrderForm({
  pricing,
  initialData,
}: {
  pricing: PricingRow[]
  initialData?: ExistingOrder
}) {
  const isEditMode = !!initialData

  const [items, setItems] = useState<OrderItem[]>(initialData?.items ?? [])
  const [riceType, setRiceType] = useState(riceTypes[0])
  const [packageType, setPackageType] = useState(packageTypes[0])
  const [quantity, setQuantity] = useState("")
  const [itemError, setItemError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const priceMap = new Map(pricing.map((p) => [`${p.riceType}_${p.packageType}`, p.price]))

  function handleAddItem() {
    setItemError(null)
    const qty = parseInt(quantity)

    if (!qty || qty < 1) {
      setItemError("Enter a quantity of at least 1")
      return
    }

    const price = priceMap.get(`${riceType}_${packageType}`)
    if (price === undefined) {
      setItemError(
        `Price not set for ${riceTypeLabels[riceType]} / ${packageTypeLabels[packageType]}. Set it in Pricing first.`
      )
      return
    }

    const weight = packageWeights[packageType]
    setItems((prev) => [
      ...prev,
      {
        riceType,
        packageType,
        quantity: qty,
        totalSize: qty * weight,
        totalPrice: qty * price,
      },
    ])
    setQuantity("")
  }

  function handleRemoveItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const orderTotal = items.reduce((sum, i) => sum + i.totalPrice, 0)

  function handleSubmit(formData: FormData) {
    setFormError(null)

    if (items.length === 0) {
      setFormError("Add at least one item to the order")
      return
    }

    formData.set(
      "items",
      JSON.stringify(items.map(({ riceType, packageType, quantity }) => ({ riceType, packageType, quantity })))
    )

    startTransition(async () => {
      const result = isEditMode
        ? await updateRiceOrder(initialData.id, formData)
        : await createRiceOrder(formData)

      if (result && !result.success) {
        setFormError(result.error ?? "Failed to save order")
      }
    })
  }

  const defaultDate = initialData
    ? new Date(initialData.date).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0]

  return (
    <form action={handleSubmit} className="max-w-3xl space-y-8">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-ink mb-1.5">
          Date
        </label>
        <input
          id="date"
          name="date"
          type="date"
          required
          defaultValue={defaultDate}
          className="w-full max-w-xs bg-white border border-line rounded-md px-3 py-2.5 text-sm text-ink outline-none focus:border-paddy transition-colors"
        />
      </div>

      <div className="space-y-5">
        <h2 className="text-xs font-semibold text-muted uppercase tracking-wide">
          Customer Details
        </h2>

        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-ink mb-1.5">
            Customer Name
          </label>
          <input
            id="customerName"
            name="customerName"
            type="text"
            required
            defaultValue={initialData?.customerName}
            className="w-full bg-white border border-line rounded-md px-3 py-2.5 text-sm text-ink outline-none focus:border-paddy transition-colors"
            placeholder="e.g. K. Perera"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="customerAddress" className="block text-sm font-medium text-ink mb-1.5">
              Address <span className="text-muted/60 font-normal">(optional)</span>
            </label>
            <input
              id="customerAddress"
              name="customerAddress"
              type="text"
              defaultValue={initialData?.customerAddress ?? ""}
              className="w-full bg-white border border-line rounded-md px-3 py-2.5 text-sm text-ink outline-none focus:border-paddy transition-colors"
              placeholder="e.g. Colombo"
            />
          </div>
          <div>
            <label htmlFor="customerPhone" className="block text-sm font-medium text-ink mb-1.5">
              Phone Number <span className="text-muted/60 font-normal">(optional)</span>
            </label>
            <input
              id="customerPhone"
              name="customerPhone"
              type="tel"
              maxLength={10}
              pattern="\d{10}"
              title="Enter exactly 10 digits"
              defaultValue={initialData?.customerPhone ?? ""}
              className="w-full bg-white border border-line rounded-md px-3 py-2.5 text-sm text-ink outline-none focus:border-paddy transition-colors"
              placeholder="07X XXXXXXX"
            />
          </div>
        </div>

        <div>
          <label htmlFor="note" className="block text-sm font-medium text-ink mb-1.5">
            Note <span className="text-muted/60 font-normal">(optional)</span>
          </label>
          <textarea
            id="note"
            name="note"
            rows={2}
            defaultValue={initialData?.note ?? ""}
            className="w-full bg-white border border-line rounded-md px-3 py-2.5 text-sm text-ink outline-none focus:border-paddy transition-colors resize-none"
            placeholder="Any additional notes..."
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xs font-semibold text-muted uppercase tracking-wide">Add Item</h2>

        <div className="flex items-end gap-3 p-4 bg-ink/[0.02] border border-line rounded-md">
          <div className="flex-1">
            <label className="block text-xs text-muted mb-1.5">Rice Type</label>
            <select
              value={riceType}
              onChange={(e) => setRiceType(e.target.value)}
              className="w-full bg-white border border-line rounded-md px-3 py-2.5 text-sm text-ink outline-none focus:border-paddy"
            >
              {riceTypes.map((rt) => (
                <option key={rt} value={rt}>
                  {riceTypeLabels[rt]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-xs text-muted mb-1.5">Package Size</label>
            <select
              value={packageType}
              onChange={(e) => setPackageType(e.target.value)}
              className="w-full bg-white border border-line rounded-md px-3 py-2.5 text-sm text-ink outline-none focus:border-paddy"
            >
              {packageTypes.map((pt) => (
                <option key={pt} value={pt}>
                  {packageTypeLabels[pt]}
                </option>
              ))}
            </select>
          </div>

          <div className="w-28">
            <label className="block text-xs text-muted mb-1.5">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-white border border-line rounded-md px-3 py-2.5 text-sm text-ink outline-none focus:border-paddy"
              placeholder="0"
            />
          </div>

          <button
            type="button"
            onClick={handleAddItem}
            className="flex items-center gap-1.5 bg-ink text-paper px-4 py-2.5 rounded-md hover:opacity-90 transition-opacity text-sm font-medium"
          >
            <Plus size={16} />
            Add
          </button>
        </div>

        {itemError && <p className="text-accent-red text-sm">{itemError}</p>}

        {items.length > 0 && (
          <div className="border border-line rounded-md overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-ink/[0.035] border-b border-line">
                  <th className="text-left text-xs font-semibold text-ink/70 uppercase tracking-wide px-4 py-2.5">
                    Rice Type
                  </th>
                  <th className="text-left text-xs font-semibold text-ink/70 uppercase tracking-wide px-4 py-2.5">
                    Package
                  </th>
                  <th className="text-right text-xs font-semibold text-ink/70 uppercase tracking-wide px-4 py-2.5">
                    Qty
                  </th>
                  <th className="text-right text-xs font-semibold text-ink/70 uppercase tracking-wide px-4 py-2.5">
                    Size (kg)
                  </th>
                  <th className="text-right text-xs font-semibold text-ink/70 uppercase tracking-wide px-4 py-2.5">
                    Total
                  </th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody className="bg-white/60">
                {items.map((item, i) => (
                  <tr key={i} className={i !== items.length - 1 ? "border-b border-line" : ""}>
                    <td className="px-4 py-2.5 text-sm text-ink">{riceTypeLabels[item.riceType]}</td>
                    <td className="px-4 py-2.5 text-sm text-ink">{packageTypeLabels[item.packageType]}</td>
                    <td className="px-4 py-2.5 text-sm text-ink text-right">{item.quantity}</td>
                    <td className="px-4 py-2.5 text-sm text-ink text-right">{item.totalSize.toFixed(2)}</td>
                    <td className="px-4 py-2.5 text-sm text-ink font-medium text-right">
                      Rs. {item.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(i)}
                        className="p-1 rounded text-muted/50 hover:text-accent-red transition-colors"
                      >
                        <X size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-5 py-4 bg-paddy/5 border border-paddy/20 rounded-md">
        <span className="text-sm text-ink/70">Order Total</span>
        <span className="font-serif text-xl text-ink">Rs. {orderTotal.toFixed(2)}</span>
      </div>

      {formError && <p className="text-accent-red text-sm">{formError}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="bg-paddy text-paper px-6 py-2.5 rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity text-sm font-medium"
      >
        {isPending ? "Saving..." : isEditMode ? "Update Order" : "Save Order"}
      </button>
    </form>
  )
}