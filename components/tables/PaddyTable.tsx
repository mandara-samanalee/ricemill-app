import Link from "next/link"
import { paddyTypeLabels } from "@/lib/utils/labels"
import { PaddyRowActions } from "@/components/paddy/PaddyRowActions"

type PaddyEntry = {
  id: string
  date: Date
  customerName: string
  area: string
  phoneNumber: string | null
  paddyType: string
  amountKg: number
  pricePerKg: number
  totalPrice: number
}

export function PaddyTable({ entries }: { entries: PaddyEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="border border-dashed border-line rounded-lg py-16 flex flex-col items-center justify-center text-center">
        <p className="text-muted text-sm mb-4">No paddy entries yet.</p>
        <Link
          href="/paddy/new"
          className="text-paddy text-sm font-medium hover:underline"
        >
          Add your first entry
        </Link>
      </div>
    )
  }

  return (
    <div className="border border-line rounded-lg overflow-hidden overflow-x-auto">
      <table className="w-full min-w-[900px]">
        <thead>
          <tr className="bg-ink/[0.035] border-b border-line">
            <th className="text-left text-xs font-semibold text-ink/70 uppercase tracking-wide px-5 py-3.5">
              Date
            </th>
            <th className="text-left text-xs font-semibold text-ink/70 uppercase tracking-wide px-3 py-3.5">
              Customer
            </th>
            <th className="text-left text-xs font-semibold text-ink/70 uppercase tracking-wide px-3 py-3.5">
              Area
            </th>
            <th className="text-left text-xs font-semibold text-ink/70 uppercase tracking-wide px-3 py-3.5">
              Type
            </th>
            <th className="text-right text-xs font-semibold text-ink/70 uppercase tracking-wide px-3 py-3.5">
              Amount (kg)
            </th>
            <th className="text-right text-xs font-semibold text-ink/70 uppercase tracking-wide px-3 py-3.5">
              Rate/kg
            </th>
            <th className="text-right text-xs font-semibold text-ink/70 uppercase tracking-wide px-5 py-3.5">
              Total
            </th>
            <th className="text-right text-xs font-semibold text-ink/70 uppercase tracking-wide px-5 py-3.5">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white/60">
          {entries.map((entry, i) => (
            <tr
              key={entry.id}
              className={`${
                i !== entries.length - 1 ? "border-b border-line" : ""
              } hover:bg-ink/[0.015] transition-colors`}
            >
              <td className="px-5 py-3 text-sm text-ink whitespace-nowrap">
                {new Date(entry.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="px-3 py-3 text-sm text-ink font-medium whitespace-nowrap">
                {entry.customerName}
              </td>
              <td className="px-3 py-3 text-sm text-ink/70 whitespace-nowrap">{entry.area}</td>
              <td className="px-3 py-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    entry.paddyType === "WET"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {paddyTypeLabels[entry.paddyType]}
                </span>
              </td>
              <td className="px-3 py-3 text-sm text-ink text-right whitespace-nowrap">
                {entry.amountKg.toFixed(2)}
              </td>
              <td className="px-3 py-3 text-sm text-ink/70 text-right whitespace-nowrap">
                Rs. {entry.pricePerKg.toFixed(2)}
              </td>
              <td className="px-5 py-3 text-sm text-ink font-medium text-right whitespace-nowrap">
                Rs. {entry.totalPrice.toFixed(2)}
              </td>
              <td className="px-5 py-3 text-right whitespace-nowrap">
                <PaddyRowActions id={entry.id} customerName={entry.customerName} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}