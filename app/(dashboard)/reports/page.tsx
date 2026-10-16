import Link from "next/link"
import { Wheat, Receipt, ArrowRight } from "lucide-react"

const reportLinks = [
  {
    href: "/reports/paddy",
    icon: Wheat,
    title: "Paddy Stock Report",
    description: "Entries, total weight, and value of paddy purchased.",
  },
  {
    href: "/reports/rice",
    icon: Receipt,
    title: "Rice Orders Report",
    description: "Orders, packages, weight, and revenue from rice sales.",
  },
]

export default function ReportsLandingPage() {
  return (
    <div className="p-10">
      <h1 className="font-serif text-ink text-2xl mb-1">Reports</h1>
      <p className="text-muted text-sm mb-8">Choose a report to view, filter by date, and export.</p>

      <div className="grid grid-cols-2 gap-4 max-w-2xl">
        {reportLinks.map((r) => (
          <Link
            key={r.href}
            href={r.href}
            className="group border border-line rounded-lg p-5 bg-white/60 hover:border-paddy transition-colors"
          >
            <r.icon size={20} className="text-paddy mb-3" />
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-ink text-lg">{r.title}</h2>
              <ArrowRight
                size={16}
                className="text-muted/40 group-hover:text-paddy group-hover:translate-x-0.5 transition-all"
              />
            </div>
            <p className="text-muted text-sm mt-1.5">{r.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}