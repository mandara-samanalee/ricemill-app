'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import { formatRs, formatKg, formatCompact } from "@/lib/utils/format"

type Row = { type: string; kg: number; value: number }

const cardTones = {
  green: { card: "border-[#1E7A3E]/30 bg-[#1E7A3E]/[0.05]", title: "text-[#17602F]" },
  amber: { card: "border-[#B8862B]/30 bg-[#B8862B]/[0.06]", title: "text-[#8A6420]" },
} as const

type CardTone = keyof typeof cardTones

export function CategoryBreakdown({
  title,
  data,
  labels,
  color,
  tone,
}: {
  title: string
  data: Row[]
  labels: Record<string, string>
  color: string
  tone: CardTone
}) {
  const totalKg = data.reduce((s, d) => s + d.kg, 0)
  const rows = data.map((d) => ({
    ...d,
    label: labels[d.type] ?? d.type,
    share: totalKg > 0 ? (d.kg / totalKg) * 100 : 0,
  }))

  return (
    <div className={`border rounded-lg p-5 ${cardTones[tone].card}`}>
      <h2 className={`text-xs font-semibold uppercase tracking-wide mb-4 ${cardTones[tone].title}`}>
        {title}
      </h2>

      {totalKg === 0 ? (
        <p className="text-muted text-sm py-12 text-center">No data in this period.</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#E3DDC9" strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: "#6B655A" }}
                axisLine={{ stroke: "#E3DDC9" }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatCompact}
                tick={{ fontSize: 12, fill: "#6B655A" }}
                axisLine={false}
                tickLine={false}
                width={44}
              />
              <Tooltip
                cursor={{ fill: "rgba(27,27,27,0.03)" }}
                contentStyle={{ fontSize: 13, borderRadius: 8, border: "1px solid #E3DDC9" }}
                formatter={(value) => formatKg(Number(value))}
              />
              <Bar dataKey="kg" name="Weight" fill={color} radius={[3, 3, 0, 0]} maxBarSize={56} />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-5 border border-line rounded-md overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-ink/[0.035] border-b border-line">
                  <th className="text-left text-xs font-semibold text-ink/70 uppercase tracking-wide px-4 py-2.5">
                    Type
                  </th>
                  <th className="text-right text-xs font-semibold text-ink/70 uppercase tracking-wide px-3 py-2.5">
                    Weight
                  </th>
                  <th className="text-right text-xs font-semibold text-ink/70 uppercase tracking-wide px-3 py-2.5">
                    Share
                  </th>
                  <th className="text-right text-xs font-semibold text-ink/70 uppercase tracking-wide px-4 py-2.5">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/60">
                {rows.map((r, i) => (
                  <tr key={r.type} className={i !== rows.length - 1 ? "border-b border-line" : ""}>
                    <td className="px-4 py-2.5 text-sm text-ink font-medium">{r.label}</td>
                    <td className="px-3 py-2.5 text-sm text-ink text-right">{formatKg(r.kg)}</td>
                    <td className="px-3 py-2.5 text-sm text-ink/70 text-right">{r.share.toFixed(1)}%</td>
                    <td className="px-4 py-2.5 text-sm text-ink text-right">{formatRs(r.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}