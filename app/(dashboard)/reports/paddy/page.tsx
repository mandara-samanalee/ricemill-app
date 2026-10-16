import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getDateRangeFromPreset, rangePresetLabels } from "@/lib/utils/dateRanges"
import { getPaddyEntriesInRange, getPaddyReportSummary } from "@/lib/services/reports/reportService"
import { DateRangeFilter } from "@/components/reports/DateRangeFilter"
import { ExportPdfButton } from "@/components/reports/ExportPdfButton"
import { ExportCsvButton } from "@/components/reports/ExportCsvButton"
import { ReportPaddyTable } from "@/components/tables/ReportPaddyTable"
import { StatCard } from "@/components/shared/StatCard"
import { PrintHeader } from "@/components/reports/PrintHeader"
import { paddyTypeLabels } from "@/lib/utils/labels"

export default async function PaddyReportPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string; from?: string; to?: string }>
}) {
  const { range = "this_month", from, to } = await searchParams
  const { start, end } = getDateRangeFromPreset(range, from, to)

  const [summary, entries] = await Promise.all([
    getPaddyReportSummary(start, end),
    getPaddyEntriesInRange(start, end),
  ])

  const rangeLabel =
    range === "custom"
      ? `${start.toLocaleDateString("en-GB")} – ${end.toLocaleDateString("en-GB")}`
      : rangePresetLabels[range]
  const csvRows = [
    ...entries.map((entry) => [
      entry.date.toLocaleDateString("en-GB"),
      entry.customerName,
      entry.area,
      entry.phoneNumber ?? "",
      paddyTypeLabels[entry.paddyType] ?? entry.paddyType,
      entry.amountKg.toFixed(2),
      entry.pricePerKg.toFixed(2),
      entry.totalPrice.toFixed(2),
    ]),
    [
      "Report Total",
      "",
      "",
      "",
      "",
      summary.totalKg.toFixed(2),
      "",
      summary.totalValue.toFixed(2),
    ],
  ]

  return (
    <div className="p-10 print:p-0">
      <Link
        href="/reports"
        className="inline-flex items-center gap-1.5 text-muted text-sm hover:text-ink transition-colors mb-6 print:hidden"
      >
        <ArrowLeft size={15} />
        Back to Reports
      </Link>

      <PrintHeader title="Paddy Stock Report" rangeLabel={rangeLabel} />

      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="font-serif text-ink text-2xl mb-1">Paddy Stock Report</h1>
          <p className="text-muted text-sm print:hidden">All paddy entries for the selected period.</p>
          <p className="hidden print:block text-muted text-sm">{rangeLabel}</p>
        </div>
        <div className="flex gap-2">
          <ExportCsvButton
            filename="paddy-stock-report.csv"
            headers={["Date", "Customer", "Area", "Phone", "Type", "Amount (kg)", "Rate/kg", "Total"]}
            rows={csvRows}
          />
          <ExportPdfButton documentTitle="Paddy Stock Report" />
        </div>
      </div>

      <DateRangeFilter />

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Entries" value={summary.totalEntries.toString()} />
        <StatCard label="Total Amount" value={`${summary.totalKg.toFixed(2)} kg`} />
        <StatCard label="Total Value" value={`Rs. ${summary.totalValue.toFixed(2)}`} />
      </div>

      <ReportPaddyTable entries={entries} />
    </div>
  )
}