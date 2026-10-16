import { riceTypeLabels, packageTypeLabels } from "@/lib/utils/labels"

type OrderWithItems = {
  id: string
  date: Date
  customerName: string
  customerAddress: string | null
  customerPhone: string | null
  note: string | null
  totalPackages: number
  totalSize: number
  totalPrice: number
  items: {
    id: string
    riceType: string
    packageType: string
    quantity: number
    totalSize: number
    totalPrice: number
  }[]
}

const currency = (value: number) => `Rs. ${value.toFixed(2)}`

export function ReportOrderItemsTable({ orders }: { orders: OrderWithItems[] }) {
  if (orders.length === 0) {
    return <p className="text-muted text-sm py-6">No rice orders in this period.</p>
  }

  return (
    <div className="border border-line rounded-lg overflow-hidden overflow-x-auto print:overflow-visible print:border-ink/30">
      <table className="w-full min-w-[1200px] print:min-w-0 print:w-full print:text-[9px]">
        <thead>
          <tr className="bg-ink/[0.035] border-b border-line">
            <th className="text-left text-xs font-semibold text-ink/70 uppercase tracking-wide px-3 py-3">Date</th>
            <th className="text-left text-xs font-semibold text-ink/70 uppercase tracking-wide px-3 py-3">Customer</th>
            <th className="text-left text-xs font-semibold text-ink/70 uppercase tracking-wide px-3 py-3">Phone</th>
            <th className="text-left text-xs font-semibold text-ink/70 uppercase tracking-wide px-3 py-3">Address</th>
            <th className="text-left text-xs font-semibold text-ink/70 uppercase tracking-wide px-3 py-3">Note</th>
            <th className="text-left text-xs font-semibold text-ink/70 uppercase tracking-wide px-3 py-3">Order Description</th>
            <th className="text-right text-xs font-semibold text-ink/70 uppercase tracking-wide px-3 py-3">Price / Package</th>
            <th className="text-right text-xs font-semibold text-ink/70 uppercase tracking-wide px-3 py-3">Order Size (kg)</th>
            <th className="text-right text-xs font-semibold text-ink/70 uppercase tracking-wide px-3 py-3">Order Packages</th>
            <th className="text-right text-xs font-semibold text-ink/70 uppercase tracking-wide px-3 py-3">Order Total</th>
          </tr>
        </thead>
        <tbody className="bg-white/60">
          {orders.map((order, i) => (
            <tr key={order.id} className={i !== orders.length - 1 ? "border-b border-line" : ""}>
              <td className="px-3 py-2.5 text-sm text-ink whitespace-nowrap">
                {new Date(order.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
              </td>
              <td className="px-3 py-2.5 text-sm text-ink font-medium">{order.customerName}</td>
              <td className="px-3 py-2.5 text-sm text-ink/70 whitespace-nowrap">{order.customerPhone || "—"}</td>
              <td className="px-3 py-2.5 text-sm text-ink/70">{order.customerAddress || "—"}</td>
              <td className="px-3 py-2.5 text-sm text-ink/70">{order.note || "-"}</td>
              <td className="px-3 py-2.5 text-sm text-ink/70">
                <ul className="space-y-1">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      <span className="font-medium text-ink">
                        {riceTypeLabels[item.riceType] ?? item.riceType} {packageTypeLabels[item.packageType] ?? item.packageType}
                      </span>
                      {` - ${item.quantity} ${item.quantity === 1 ? "package" : "packages"} (${item.totalSize.toFixed(2)} kg)`}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="px-3 py-2.5 text-sm text-ink/70 text-right whitespace-nowrap">
                <ul className="space-y-1">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {currency(item.quantity > 0 ? item.totalPrice / item.quantity : 0)} / pkg
                    </li>
                  ))}
                </ul>
              </td>
              <td className="px-3 py-2.5 text-sm text-ink text-right whitespace-nowrap">{order.totalSize.toFixed(2)}</td>
              <td className="px-3 py-2.5 text-sm text-ink text-right whitespace-nowrap">{order.totalPackages}</td>
              <td className="px-3 py-2.5 text-sm text-ink font-medium text-right whitespace-nowrap">{currency(order.totalPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
