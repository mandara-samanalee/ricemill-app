'use client'

import { FileSpreadsheet } from "lucide-react"

type CsvValue = string | number

function escapeCsvValue(value: CsvValue) {
  const text = String(value)
  const safeText = typeof value === "string" && /^[\t\r ]*[=+\-@]/.test(text)
    ? `'${text}`
    : text
  return `"${safeText.replaceAll('"', '""')}"`
}

export function ExportCsvButton({
  filename,
  headers,
  rows,
}: {
  filename: string
  headers: string[]
  rows: CsvValue[][]
}) {
  function downloadCsv() {
    const content = [headers, ...rows]
      .map((row) => row.map(escapeCsvValue).join(","))
      .join("\r\n")
    const blob = new Blob(["\uFEFF", content], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={downloadCsv}
      className="flex items-center gap-2 bg-white border border-line text-ink px-4 py-2.5 rounded-md hover:bg-ink/[0.03] transition-colors text-sm font-medium print:hidden"
    >
      <FileSpreadsheet size={16} />
      Export CSV
    </button>
  )
}
