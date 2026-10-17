import { StatCard } from "@/components/shared/StatCard"
import { MonthlyTrend } from "@/components/dashboard/MonthlyTrend"
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown"
import { getDashboardData } from "@/lib/services/dashboard/dashboardService"
import { riceTypeLabels, paddyTypeLabels } from "@/lib/utils/labels"
import { formatRs, formatKg } from "@/lib/utils/format"

export default async function DashboardPage() {
  const { trend, totals, riceByType, paddyByType } = await getDashboardData()

  return (
    <div className="p-10">
      <h1 className="font-serif text-ink text-2xl mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          tone="amber"
          label="Total Paddy Cost"
          value={formatRs(totals.paddyCost)}
          hint={`${formatKg(totals.paddyKg)} purchased`}
        />
        <StatCard
          tone="green"
          label="Total Rice Sold"
          value={formatKg(totals.riceKg)}
          hint={`${totals.ricePackages} packages`}
        />
        <StatCard
          tone="ink"
          label="Total Revenue"
          value={formatRs(totals.riceRevenue)}
          hint={`Net ${formatRs(totals.net)}`}
        />
      </div>

      <div className="mb-6">
        <MonthlyTrend data={trend} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryBreakdown
          title="Rice Sold by Type"
          data={riceByType}
          labels={riceTypeLabels}
          color="#1E7A3E"
          tone="green"
        />
        <CategoryBreakdown
          title="Paddy by Type"
          data={paddyByType}
          labels={paddyTypeLabels}
          color="#B8862B"
          tone="amber"
        />
      </div>
    </div>
  )
}