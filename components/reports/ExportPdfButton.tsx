'use client'

import { Download } from "lucide-react"

export function ExportPdfButton({ documentTitle }: { documentTitle: string }) {
  function exportPdf() {
    const previousTitle = document.title
    const restoreTitle = () => {
      document.title = previousTitle
      window.removeEventListener("afterprint", restoreTitle)
    }

    document.title = documentTitle
    window.addEventListener("afterprint", restoreTitle)
    window.print()
  }

  return (
    <button
      onClick={exportPdf}
      className="flex items-center gap-2 bg-ink text-paper px-4 py-2.5 rounded-md hover:opacity-90 transition-opacity text-sm font-medium print:hidden"
    >
      <Download size={16} />
      Export PDF
    </button>
  )
}