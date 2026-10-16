'use client'

import { useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

const presets = [
  { value: "this_month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
  { value: "this_year", label: "This Year" },
  { value: "custom", label: "Custom" },
]

export function DateRangeFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentRange = searchParams.get("range") ?? "this_month"
  const [customFrom, setCustomFrom] = useState(searchParams.get("from") ?? "")
  const [customTo, setCustomTo] = useState(searchParams.get("to") ?? "")

  function applyPreset(preset: string) {
    const params = new URLSearchParams()
    params.set("range", preset)
    router.push(`${pathname}?${params.toString()}`)
  }

  function applyCustom() {
    if (!customFrom || !customTo) return
    const params = new URLSearchParams()
    params.set("range", "custom")
    params.set("from", customFrom)
    params.set("to", customTo)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6 print:hidden">
      {presets.map((p) => (
        <button
          key={p.value}
          onClick={() => applyPreset(p.value)}
          className={`px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${
            currentRange === p.value
              ? "bg-paddy text-paper"
              : "bg-white border border-line text-ink hover:bg-ink/[0.03]"
          }`}
        >
          {p.label}
        </button>
      ))}

      {currentRange === "custom" && (
        <div className="flex items-center gap-2 ml-2">
          <input
            type="date"
            value={customFrom}
            onChange={(e) => setCustomFrom(e.target.value)}
            className="bg-white border border-line rounded-md px-2.5 py-1.5 text-sm text-ink outline-none focus:border-paddy"
          />
          <span className="text-muted text-sm">to</span>
          <input
            type="date"
            value={customTo}
            onChange={(e) => setCustomTo(e.target.value)}
            className="bg-white border border-line rounded-md px-2.5 py-1.5 text-sm text-ink outline-none focus:border-paddy"
          />
          <button
            onClick={applyCustom}
            className="bg-ink text-paper px-3 py-1.5 rounded-md text-sm font-medium hover:opacity-90"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  )
}