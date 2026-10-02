'use client'

import { useState, useTransition } from "react"
import { Trash2 } from "lucide-react"

export function ConfirmDeleteButton({
  onDelete,
  itemLabel,
}: {
  onDelete: () => Promise<void>
  itemLabel: string
}) {
  const [confirming, setConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()

  if (confirming) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="text-muted">Delete {itemLabel}?</span>
        <button
          onClick={() => startTransition(onDelete)}
          disabled={isPending}
          className="text-accent-red font-medium hover:underline disabled:opacity-50"
        >
          {isPending ? "Deleting..." : "Yes, delete"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={isPending}
          className="text-muted hover:text-ink"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      title={`Delete ${itemLabel}`}
      className="p-1.5 rounded text-muted/50 hover:text-accent-red hover:bg-accent-red/5 transition-colors"
    >
      <Trash2 size={15} />
    </button>
  )
}