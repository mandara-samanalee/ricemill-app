'use client'

import Link from "next/link"
import { Pencil } from "lucide-react"
import { ConfirmDeleteButton } from "@/components/shared/ConfirmDeleteButton"
import { removeOrder } from "@/app/(dashboard)/orders/order.actions"

export function OrderRowActions({ id, customerName }: { id: string; customerName: string }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Link
        href={`/orders/${id}/edit`}
        title="Edit order"
        className="p-1.5 rounded text-muted/50 hover:text-paddy hover:bg-paddy/5 transition-colors inline-flex"
      >
        <Pencil size={15} />
      </Link>
      <ConfirmDeleteButton
        itemLabel={`${customerName}'s order`}
        onDelete={() => removeOrder(id)}
      /> 
    </div>
  )
}