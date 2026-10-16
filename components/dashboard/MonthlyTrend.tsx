'use client'

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  CartesianGrid,
} from "recharts"
import { formatRs, formatKg, formatCompact } from "@/lib/utils/format"

export type TrendRow = {
  month: string
  paddyKg: number
  paddyCost: number
  riceKg: number
  riceRevenue: number
  net: number
}

const COLORS = { paddy: "#B8862B", rice: "#1E7A3E", net: "#1B1B1B" }

function TrendTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload: TrendRow }[]
}) {
  if (!active || !payload?.length) return null
  const row = payload[0].payload

  return (
    <div className="bg-white border border-line rounded-md px-3 py-2.5 text-xs shadow-sm min-w-[200px]">
      <div className="font-medium text-ink mb-2">{row.month}</div>

      <div className="flex justify-between gap-4 text-ink">
        <span>Paddy cost</span>
        <span>{formatRs(row.paddyCost)}</span>
      </div>
      <div className="text-muted mb-2">{formatKg(row.paddyKg)} bought</div>

      <div className="flex justify-between gap-4 text-ink">
        <span>Rice revenue</span>
        <span>{formatRs(row.riceRevenue)}</span>
      </div>
      <div className="text-muted mb-2">{formatKg(row.riceKg)} sold</div>

      <div className="flex justify-between gap-4 font-medium text-ink pt-2 border-t border-line">
        <span>Net</span>
        <span className={row.net >= 0 ? "text-paddy" : "text-accent-red"}>
          {formatRs(row.net)}
        </span>
      </div>
    </div>
  )
}

export function MonthlyTrend({ data }: { data: TrendRow[] }) {
  const period = data.length > 0 ? `${data[0].month} – ${data[data.length - 1].month}` : ""

  return (
    <div className="border border-line border-t-4 border-t-ink rounded-lg p-5 bg-white/60">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-4">
        <h2 className="text-xs font-semibold text-muted uppercase tracking-wide">
          Monthly Trend
        </h2>
        <p className="text-muted text-xs">
          Last {data.length} months{period ? ` · ${period}` : ""}
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#E3DDC9" strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#6B655A" }}
            axisLine={{ stroke: "#E3DDC9" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatCompact}
            tick={{ fontSize: 12, fill: "#6B655A" }}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <Tooltip content={<TrendTooltip />} cursor={{ fill: "rgba(27,27,27,0.03)" }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <ReferenceLine y={0} stroke="#1B1B1B" strokeOpacity={0.3} />
          <Bar dataKey="paddyCost" name="Paddy Cost" fill={COLORS.paddy} radius={[3, 3, 0, 0]} maxBarSize={38} />
          <Bar dataKey="riceRevenue" name="Rice Revenue" fill={COLORS.rice} radius={[3, 3, 0, 0]} maxBarSize={38} />
          <Line
            dataKey="net"
            name="Net"
            stroke={COLORS.net}
            strokeWidth={2}
            dot={{ r: 4, fill: COLORS.net }}
            activeDot={{ r: 5 }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="mt-6 border border-line rounded-md overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="bg-ink/[0.035] border-b border-line">
              <th className="text-left text-xs font-semibold text-ink/70 uppercase tracking-wide px-4 py-2.5">
                Month
              </th>
              <th className="text-right text-xs font-semibold text-ink/70 uppercase tracking-wide px-3 py-2.5">
                Paddy (kg)
              </th>
              <th className="text-right text-xs font-semibold text-ink/70 uppercase tracking-wide px-3 py-2.5">
                Paddy Cost
              </th>
              <th className="text-right text-xs font-semibold text-ink/70 uppercase tracking-wide px-3 py-2.5">
                Rice Sold (kg)
              </th>
              <th className="text-right text-xs font-semibold text-ink/70 uppercase tracking-wide px-3 py-2.5">
                Rice Revenue
              </th>
              <th className="text-right text-xs font-semibold text-ink/70 uppercase tracking-wide px-4 py-2.5">
                Net
              </th>
            </tr>
          </thead>
          <tbody className="bg-white/60">
            {data.map((row, i) => (
              <tr key={row.month} className={i !== data.length - 1 ? "border-b border-line" : ""}>
                <td className="px-4 py-2.5 text-sm text-ink font-medium">{row.month}</td>
                <td className="px-3 py-2.5 text-sm text-ink/70 text-right">{formatKg(row.paddyKg)}</td>
                <td className="px-3 py-2.5 text-sm text-ink text-right">{formatRs(row.paddyCost)}</td>
                <td className="px-3 py-2.5 text-sm text-ink/70 text-right">{formatKg(row.riceKg)}</td>
                <td className="px-3 py-2.5 text-sm text-ink text-right">{formatRs(row.riceRevenue)}</td>
                <td
                  className={`px-4 py-2.5 text-sm font-medium text-right ${
                    row.net >= 0 ? "text-paddy" : "text-accent-red"
                  }`}
                >
                  {formatRs(row.net)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}