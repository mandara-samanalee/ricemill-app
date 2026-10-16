const tones = {
  neutral: {
    card: "border-line bg-white/60",
    label: "text-muted",
    value: "text-ink",
    hint: "text-muted",
  },
  amber: {
    card: "border-[#B8862B]/30 border-l-4 border-l-[#B8862B] bg-[#B8862B]/[0.08]",
    label: "text-[#8A6420]",
    value: "text-[#5E4311]",
    hint: "text-[#8A6420]/80",
  },
  green: {
    card: "border-[#1E7A3E]/30 border-l-4 border-l-[#1E7A3E] bg-[#1E7A3E]/[0.08]",
    label: "text-[#17602F]",
    value: "text-[#0F4020]",
    hint: "text-[#17602F]/80",
  },
  ink: {
    card: "border-ink/20 border-l-4 border-l-ink bg-ink/[0.05]",
    label: "text-ink/70",
    value: "text-ink",
    hint: "text-ink/60",
  },
}

export type StatTone = keyof typeof tones

export function StatCard({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string
  value: string
  hint?: string
  tone?: StatTone
}) {
  const t = tones[tone]

  return (
    <div className={`border rounded-lg px-5 py-4 ${t.card}`}>
      <div className={`text-xs uppercase tracking-wide mb-1 ${t.label}`}>{label}</div>
      <div className={`font-serif text-xl ${t.value}`}>{value}</div>
      {hint && <div className={`text-xs mt-1 ${t.hint}`}>{hint}</div>}
    </div>
  )
}