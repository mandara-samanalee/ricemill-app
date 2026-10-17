'use client'

import { useState, useTransition } from "react"
import { createPaddy, updatePaddy } from "@/app/(dashboard)/paddy/paddy.actions"

type PaddyEntryData = {
  id: string
  date: Date
  customerName: string
  area: string
  phoneNumber: string | null
  paddyType: string
  amountKg: number
  pricePerKg: number
}

export function PaddyForm({ initialData }: { initialData?: PaddyEntryData }) {
  const isEditMode = !!initialData

  const [amountKg, setAmountKg] = useState(initialData?.amountKg.toString() ?? "")
  const [pricePerKg, setPricePerKg] = useState(initialData?.pricePerKg.toString() ?? "")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const total = (parseFloat(amountKg) || 0) * (parseFloat(pricePerKg) || 0)

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = isEditMode
        ? await updatePaddy(initialData.id, formData)
        : await createPaddy(formData)

      if (result && !result.success) {
        setError(result.error ?? "Failed to save entry")
      }
    })
  }

  const defaultDate = initialData
    ? new Date(initialData.date).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0]

  return (
    <form action={handleSubmit} className="max-w-xl space-y-8">
      {/* Date */}
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
          className="w-full bg-white border border-line rounded-md px-3 py-2.5 text-sm text-ink outline-none focus:border-paddy transition-colors"
        />
      </div>

      {/* Customer details */}
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
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="area" className="block text-sm font-medium text-ink mb-1.5">
              Area
            </label>
            <input
              id="area"
              name="area"
              type="text"
              required
              defaultValue={initialData?.area}
              className="w-full bg-white border border-line rounded-md px-3 py-2.5 text-sm text-ink outline-none focus:border-paddy transition-colors"
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-ink mb-1.5">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              maxLength={10}
              pattern="\d{10}"
              title="Enter exactly 10 digits"
              defaultValue={initialData?.phoneNumber ?? ""}
              className="w-full bg-white border border-line rounded-md px-3 py-2.5 text-sm text-ink outline-none focus:border-paddy transition-colors"
              placeholder="07X XXXXXXX"
            />
          </div>
        </div>
      </div>

      {/* Paddy details */}
      <div className="space-y-5">
        <h2 className="text-xs font-semibold text-muted uppercase tracking-wide">
          Paddy Details
        </h2>

        <div>
          <label className="block text-sm font-medium text-ink mb-2">Paddy Type</label>
          <div className="flex gap-3">
            {[
              { value: "DRY", label: "Dry" },
              { value: "WET", label: "Wet" },
            ].map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 px-4 py-2.5 border border-line rounded-md cursor-pointer has-[:checked]:border-paddy has-[:checked]:bg-paddy/5 transition-colors"
              >
                <input
                  type="radio"
                  name="paddyType"
                  value={opt.value}
                  required
                  defaultChecked={initialData?.paddyType === opt.value}
                  className="accent-paddy"
                />
                <span className="text-sm text-ink">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="amountKg" className="block text-sm font-medium text-ink mb-1.5">
              Amount (kg)
            </label>
            <input
              id="amountKg"
              name="amountKg"
              type="number"
              step="0.01"
              min="0"
              required
              value={amountKg}
              onChange={(e) => setAmountKg(e.target.value)}
              className="w-full bg-white border border-line rounded-md px-3 py-2.5 text-sm text-ink outline-none focus:border-paddy transition-colors"
              placeholder="0.00"
            />
          </div>
          <div>
            <label htmlFor="pricePerKg" className="block text-sm font-medium text-ink mb-1.5">
              Price per kg
            </label>
            <input
              id="pricePerKg"
              name="pricePerKg"
              type="number"
              step="0.01"
              min="0"
              required
              value={pricePerKg}
              onChange={(e) => setPricePerKg(e.target.value)}
              className="w-full bg-white border border-line rounded-md px-3 py-2.5 text-sm text-ink outline-none focus:border-paddy transition-colors"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      {/* Live total */}
      <div className="flex items-center justify-between px-5 py-4 bg-paddy/5 border border-paddy/20 rounded-md">
        <span className="text-sm text-ink/70">Total Price</span>
        <span className="font-serif text-xl text-ink">Rs. {total.toFixed(2)}</span>
      </div>

      {error && <p className="text-accent-red text-sm">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="bg-paddy text-paper px-6 py-2.5 rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity text-sm font-medium"
      >
        {isPending ? "Saving..." : isEditMode ? "Update Entry" : "Save Entry"}
      </button>
    </form>
  )
}