export function getDateRangeFromPreset(preset: string, customFrom?: string, customTo?: string) {
  const now = new Date()
  let start: Date
  let end: Date

  switch (preset) {
    case "this_month":
      start = new Date(now.getFullYear(), now.getMonth(), 1)
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
      break
    case "last_month":
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)
      break
    case "this_year":
      start = new Date(now.getFullYear(), 0, 1)
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999)
      break
    case "custom":
      start = customFrom ? new Date(customFrom) : new Date(now.getFullYear(), now.getMonth(), 1)
      end = customTo ? new Date(`${customTo}T23:59:59.999`) : now
      break
    default:
      start = new Date(now.getFullYear(), now.getMonth(), 1)
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
  }

  return { start, end }
}

export const rangePresetLabels: Record<string, string> = {
  this_month: "This Month",
  last_month: "Last Month",
  this_year: "This Year",
  custom: "Custom Range",
}