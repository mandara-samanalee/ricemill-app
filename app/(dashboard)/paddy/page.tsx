import Link from "next/link"
import { Plus } from "lucide-react"
import { getAllPaddyEntries, getPaddySummary } from "@/lib/services/paddy/paddyService"
import { PaddyTable } from "@/components/tables/PaddyTable"
import { StatCard } from "@/components/shared/StatCard"

export default async function PaddyPage() {
  const [entries, summary] = await Promise.all([getAllPaddyEntries(), getPaddySummary()])

  return (
    <div className="p-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-serif text-ink text-2xl mb-1">Paddy Stock</h1>
          <p className="text-muted text-sm">All recorded paddy purchases.</p>
        </div>
        <Link
          href="/paddy/new"
          className="flex items-center gap-2 bg-paddy text-paper px-4 py-2.5 rounded-md hover:opacity-90 transition-opacity text-sm font-medium"
        >
          <Plus size={16} />
          Add Entry
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Entries" value={summary.count.toString()} />
        <StatCard label="Total Amount" value={`${summary.totalKg.toFixed(2)} kg`} />
        <StatCard label="Total Value" value={`Rs. ${summary.totalValue.toFixed(2)}`} />
      </div>

      <PaddyTable entries={entries} />
    </div>
  )
}