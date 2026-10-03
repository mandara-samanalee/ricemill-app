'use client'

import { Fragment, useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronRight } from "lucide-react"
import { riceTypeLabels, packageTypeLabels } from "@/lib/utils/labels"
import { OrderRowActions } from "@/components/orders/OrderRowActions"

type OrderItem = {
  id: string
  riceType: string
  packageType: string
  quantity: number
  totalSize: number
  totalPrice: number
}

type Order = {
  id: string
  date: Date
  customerName: string
  customerAddress: string | null
  customerPhone: string | null
  note: string | null
  totalPackages: number
  totalSize: number
  totalPrice: number
  items: OrderItem[]
}

export function OrderTable({ orders }: { orders: Order[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (orders.length === 0) {
    return (
      <div className="border border-dashed border-line rounded-lg py-16 flex flex-col items-center justify-center text-center">
        <p className="text-muted text-sm mb-4">No rice orders yet.</p>
        <Link href="/orders/new" className="text-paddy text-sm font-medium hover:underline">
          Add your first order
        </Link>
      </div>
    )
  }

  return (
    <div className="border border-line rounded-lg overflow-hidden overflow-x-auto">
      <table className="w-full min-w-[950px]">
        <thead>
          <tr className="bg-ink/[0.035] border-b border-line">
            <th className="w-8 px-3 py-3.5" />
            <th className="text-left text-xs font-semibold text-ink/70 uppercase tracking-wide px-2 py-3.5">
              Date
            </th>
            <th className="text-left text-xs font-semibold text-ink/70 uppercase tracking-wide px-3 py-3.5">
              Customer
            </th>
            <th className="text-left text-xs font-semibold text-ink/70 uppercase tracking-wide px-3 py-3.5">
              Address
            </th>
            <th className="text-left text-xs font-semibold text-ink/70 uppercase tracking-wide px-3 py-3.5">
              Phone
            </th>
            <th className="text-left text-xs font-semibold text-ink/70 uppercase tracking-wide px-3 py-3.5">
              Note
            </th>
            <th className="text-right text-xs font-semibold text-ink/70 uppercase tracking-wide px-3 py-3.5">
              Packages
            </th>
            <th className="text-right text-xs font-semibold text-ink/70 uppercase tracking-wide px-3 py-3.5">
              Weight (kg)
            </th>
            <th className="text-right text-xs font-semibold text-ink/70 uppercase tracking-wide px-5 py-3.5">
              Order Total
            </th>
            <th className="text-right text-xs font-semibold text-ink/70 uppercase tracking-wide px-5 py-3.5">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white/60">
          {orders.map((order, i) => {
            const isExpanded = expandedId === order.id
            const isLast = i !== orders.length - 1

            return (
              <Fragment key={order.id}>
                <tr
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  className={`cursor-pointer ${
                    isLast && !isExpanded ? "border-b border-line" : ""
                  } ${isExpanded ? "bg-paddy/[0.04]" : "hover:bg-ink/[0.015]"} transition-colors`}
                >
                  <td className="px-3 py-3 text-muted/50">
                    {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                  </td>
                  <td className="px-2 py-3 text-sm text-ink whitespace-nowrap">
                    {new Date(order.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-3 py-3 text-sm text-ink font-medium whitespace-nowrap">
                    {order.customerName}
                  </td>
                  <td className="px-3 py-3 text-sm text-ink/70 max-w-[140px] truncate">
                    {order.customerAddress || <span className="text-muted/40">—</span>}
                  </td>
                  <td className="px-3 py-3 text-sm text-ink/70 whitespace-nowrap">
                    {order.customerPhone || <span className="text-muted/40">—</span>}
                  </td>
                  <td className="px-3 py-3 text-sm text-ink/70 max-w-[140px] truncate">
                    {order.note || <span className="text-muted/40">—</span>}
                  </td>
                  <td className="px-3 py-3 text-sm text-ink text-right">{order.totalPackages}</td>
                  <td className="px-3 py-3 text-sm text-ink text-right">{order.totalSize.toFixed(2)}</td>
                  <td className="px-5 py-3 text-sm text-ink font-medium text-right whitespace-nowrap">
                    Rs. {order.totalPrice.toFixed(2)}
                  </td>
                  <td className="px-5 py-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <OrderRowActions id={order.id} customerName={order.customerName} />
                  </td>
                </tr>

                {isExpanded && (
                  <tr key={`${order.id}-detail`} className={isLast ? "border-b border-line" : ""}>
                    <td colSpan={10} className="bg-paddy/[0.03] px-5 py-4">
                      <div className="pl-9">
                        <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-2.5">
                          Items
                        </div>
                        <table className="w-full max-w-2xl">
                          <thead>
                            <tr className="border-b border-line/60">
                              <th className="text-left text-xs font-medium text-muted px-3 py-2">
                                Rice Type
                              </th>
                              <th className="text-left text-xs font-medium text-muted px-3 py-2">
                                Package
                              </th>
                              <th className="text-right text-xs font-medium text-muted px-3 py-2">
                                Qty
                              </th>
                              <th className="text-right text-xs font-medium text-muted px-3 py-2">
                                Size (kg)
                              </th>
                              <th className="text-right text-xs font-medium text-muted px-3 py-2">
                                Total price
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item) => (
                              <tr key={item.id}>
                                <td className="px-3 py-2 text-sm text-ink">
                                  {riceTypeLabels[item.riceType]}
                                </td>
                                <td className="px-3 py-2 text-sm text-ink">
                                  {packageTypeLabels[item.packageType]}
                                </td>
                                <td className="px-3 py-2 text-sm text-ink text-right">{item.quantity}</td>
                                <td className="px-3 py-2 text-sm text-ink text-right">
                                  {item.totalSize.toFixed(2)}
                                </td>
                                <td className="px-3 py-2 text-sm text-ink font-medium text-right">
                                  Rs. {item.totalPrice.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}