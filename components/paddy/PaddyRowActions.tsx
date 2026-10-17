'use client'

import Link from "next/link"
import { Pencil } from "lucide-react"
import { ConfirmDeleteButton } from "@/components/shared/ConfirmDeleteButton"
import { removePaddy } from "@/app/(dashboard)/paddy/paddy.actions"

export function PaddyRowActions({ id, customerName }: { id: string; customerName: string }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Link
        href={`/paddy/${id}/edit`}
        title="Edit entry"
        className="p-1.5 rounded text-muted/50 hover:text-paddy hover:bg-paddy/5 transition-colors inline-flex"
      >
        <Pencil size={15} />
      </Link>
      <ConfirmDeleteButton
        itemLabel={`${customerName}'s entry`}
        onDelete={() => removePaddy(id)}
      />
    </div>
  )
}