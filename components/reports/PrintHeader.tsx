import Image from "next/image"

export function PrintHeader({ title, rangeLabel }: { title: string; rangeLabel: string }) {
  return (
    <div className="hidden print:flex items-center justify-between pb-4 mb-6 border-b-2 border-ink">
      <div className="flex items-center gap-3">
        <Image src="/logo.jpg" alt="RM Rice Mill" width={44} height={44} className="mix-blend-multiply" />
        <div>
          <div className="font-serif text-ink text-lg leading-tight">RM Rice Mill</div>
          <div className="text-muted text-xs">{title}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-ink text-sm font-medium">{rangeLabel}</div>
        <div className="text-muted text-xs">
          Printed {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
        </div>
      </div>
    </div>
  )
}