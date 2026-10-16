import { paddyTypeLabels } from "@/lib/utils/labels"

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

export function ReportPaddyTable({ entries }: { entries: PaddyEntry[] }) {
  if (entries.length === 0) {
    return <p className="text-muted text-sm py-6">No paddy entries in this period.</p>
  }

  return (
    <div className="border border-line rounded-lg overflow-hidden overflow-x-auto print:overflow-visible print:border-ink/30">
      <table className="w-full min-w-[800px] print:min-w-0 print:w-full print:text-[11px]">
        <thead>
          <tr className="bg-ink/[0.035] border-b border-line">
            <th className="text-left text-xs font-semibold text-ink/70 uppercase tracking-wide px-4 py-3">Date</th>
            <th className="text-left text-xs font-semibold text-ink/70 uppercase tracking-wide px-3 py-3">Customer</th>
            <th className="text-left text-xs font-semibold text-ink/70 uppercase tracking-wide px-3 py-3">Area</th>
            <th className="text-left text-xs font-semibold text-ink/70 uppercase tracking-wide px-3 py-3">Phone</th>
            <th className="text-left text-xs font-semibold text-ink/70 uppercase tracking-wide px-3 py-3">Type</th>
            <th className="text-right text-xs font-semibold text-ink/70 uppercase tracking-wide px-3 py-3">Amount (kg)</th>
            <th className="text-right text-xs font-semibold text-ink/70 uppercase tracking-wide px-3 py-3">Rate/kg</th>
            <th className="text-right text-xs font-semibold text-ink/70 uppercase tracking-wide px-4 py-3">Total</th>
          </tr>
        </thead>
        <tbody className="bg-white/60">
          {entries.map((e, i) => (
            <tr key={e.id} className={i !== entries.length - 1 ? "border-b border-line" : ""}>
              <td className="px-4 py-2.5 text-sm text-ink whitespace-nowrap">
                {new Date(e.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
              </td>
              <td className="px-3 py-2.5 text-sm text-ink font-medium whitespace-nowrap">{e.customerName}</td>
              <td className="px-3 py-2.5 text-sm text-ink/70">{e.area}</td>
              <td className="px-3 py-2.5 text-sm text-ink/70 whitespace-nowrap">{e.phoneNumber || "—"}</td>
              <td className="px-3 py-2.5 text-sm text-ink/70">{paddyTypeLabels[e.paddyType]}</td>
              <td className="px-3 py-2.5 text-sm text-ink text-right">{e.amountKg.toFixed(2)}</td>
              <td className="px-3 py-2.5 text-sm text-ink/70 text-right">Rs. {e.pricePerKg.toFixed(2)}</td>
              <td className="px-4 py-2.5 text-sm text-ink font-medium text-right">Rs. {e.totalPrice.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}