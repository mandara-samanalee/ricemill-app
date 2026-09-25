import { riceTypeLabels, packageTypeLabels } from "@/lib/utils/labels"
import { PriceCell } from "./PriceCell"

type PricingGrid = {
  riceType: string
  packages: { packageType: string; price: number | null }[]
}[]

export function PricingTable({ grid }: { grid: PricingGrid }) {
  const packageTypes = grid[0]?.packages.map((p) => p.packageType) ?? []

  return (
    <div className="border border-line rounded-lg overflow-hidden bg-white/40">
      <table className="w-full">
        <thead>
           <tr className="bg-ink/[0.035] border-b border-line">
            <th className="text-left text-xs font-semibold text-ink/70 uppercase tracking-wide px-5 py-3.5">
              Rice Type
            </th>
            {packageTypes.map((pt) => (
              <th
                key={pt}
                className="text-left text-xs font-semibold text-ink/70 uppercase tracking-wide px-2 py-3.5"
              >
                {packageTypeLabels[pt]}
              </th>
            ))}
          </tr>
        </thead>
         <tbody className="bg-white/60">
          {grid.map((row, i) => (
            <tr
              key={row.riceType}
              className={`${
                i !== grid.length - 1 ? "border-b border-line" : ""
              } hover:bg-ink/[0.015] transition-colors`}
            >
              <td className="px-5 py-3 text-sm font-medium text-ink">
                {riceTypeLabels[row.riceType]}
              </td>
              {row.packages.map((pkg) => (
                <td key={pkg.packageType} className="px-2 py-2">
                  <PriceCell
                    riceType={row.riceType}
                    packageType={pkg.packageType}
                    price={pkg.price}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}