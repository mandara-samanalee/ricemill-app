import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getDateRangeFromPreset, rangePresetLabels } from "@/lib/utils/dateRanges"
import { getOrdersInRange, getOrderReportSummary } from "@/lib/services/reports/reportService"
import { DateRangeFilter } from "@/components/reports/DateRangeFilter"
import { ExportPdfButton } from "@/components/reports/ExportPdfButton"
import { ExportCsvButton } from "@/components/reports/ExportCsvButton"
import { ReportOrderItemsTable } from "@/components/tables/ReportOrderTable"
import { StatCard } from "@/components/shared/StatCard"
import { PrintHeader } from "@/components/reports/PrintHeader"
import { packageTypeLabels, riceTypeLabels } from "@/lib/utils/labels"

export default async function RiceReportPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string; from?: string; to?: string }>
}) {
  const { range = "this_month", from, to } = await searchParams
  const { start, end } = getDateRangeFromPreset(range, from, to)

  const [summary, orders] = await Promise.all([
    getOrderReportSummary(start, end),
    getOrdersInRange(start, end),
  ])

  const rangeLabel =
    range === "custom"
      ? `${start.toLocaleDateString("en-GB")} – ${end.toLocaleDateString("en-GB")}`
      : rangePresetLabels[range]
  const csvRows = [
    ...orders.map((order) => [
      order.date.toLocaleDateString("en-GB"),
      order.customerName,
      order.customerPhone ?? "",
      order.customerAddress ?? "",
      order.note ?? "",
      order.items
        .map((item) =>
          `${riceTypeLabels[item.riceType] ?? item.riceType} ${packageTypeLabels[item.packageType] ?? item.packageType} - ${item.quantity} ${item.quantity === 1 ? "package" : "packages"} (${item.totalSize.toFixed(2)} kg)`
        )
        .join("; "),
      order.items
        .map((item) => `Rs. ${(item.quantity > 0 ? item.totalPrice / item.quantity : 0).toFixed(2)} / pkg`)
        .join("; "),
      order.totalSize.toFixed(2),
      order.totalPackages,
      order.totalPrice.toFixed(2),
    ]),
    [
      "Report Total",
      "",
      "",
      "",
      "",
      "",
      "",
      summary.totalKg.toFixed(2),
      summary.totalPackages,
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

      <PrintHeader title="Rice Orders Report" rangeLabel={rangeLabel} />

      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="font-serif text-ink text-2xl mb-1">Rice Orders Report</h1>
          <p className="text-muted text-sm print:hidden">All rice sales for the selected period.</p>
          <p className="hidden print:block text-muted text-sm">{rangeLabel}</p>
        </div>
        <div className="flex gap-2">
          <ExportCsvButton
            filename="rice-orders-report.csv"
            headers={[
              "Date",
              "Customer",
              "Phone",
              "Address",
              "Note",
              "Order Description",
              "Price / Package",
              "Order Size (kg)",
              "Order Packages",
              "Order Total",
            ]}
            rows={csvRows}
          />
          <ExportPdfButton documentTitle="Rice Orders Report" />
        </div>
      </div>

      <DateRangeFilter />

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Orders" value={summary.totalOrders.toString()} />
        <StatCard label="Packages Sold" value={summary.totalPackages.toString()} />
        <StatCard label="Rice Sold" value={`${summary.totalKg.toFixed(2)} kg`} />
        <StatCard label="Total Revenue" value={`Rs. ${summary.totalValue.toFixed(2)}`} />
      </div>

      <ReportOrderItemsTable orders={orders} />
    </div>
  )
}