export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-line rounded-lg px-5 py-4 bg-white/60">
      <div className="text-xs text-muted uppercase tracking-wide mb-1">{label}</div>
      <div className="font-serif text-xl text-ink">{value}</div>
    </div>
  )
}