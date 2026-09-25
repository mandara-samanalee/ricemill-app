'use client'

import { useState, useTransition, useRef, useEffect } from "react"
import { X } from "lucide-react"
import { updatePrice, removePrice } from "@/app/dashboard/pricing/pricing.actions"

export function PriceCell({
  riceType,
  packageType,
  price,
}: {
  riceType: string
  packageType: string
  price: number | null
}) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(price?.toString() ?? "")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) {
      setValue(price?.toString() ?? "")
      inputRef.current?.focus()
    }
  }, [editing, price])

  function handleCancel() {
    setValue(price?.toString() ?? "")
    setError(null)
    setEditing(false)
  }

  function handleSave() {
    const trimmed = value.trim()

    // Cleared or empty on blur — revert, don't delete. Deletion is a separate, explicit action.
    if (trimmed === "") {
      handleCancel()
      return
    }

    if (price !== null && Number(trimmed) === price) {
      setEditing(false)
      return
    }

    setError(null)
    const formData = new FormData()
    formData.set("riceType", riceType)
    formData.set("packageType", packageType)
    formData.set("price", trimmed)

    startTransition(async () => {
      const result = await updatePrice(formData)
      if (!result.success) {
        setError(result.error ?? "Failed to save")
        return
      }
      setEditing(false)
    })
  }

  function handleDelete() {
    const formData = new FormData()
    formData.set("riceType", riceType)
    formData.set("packageType", packageType)

    startTransition(async () => {
      await removePrice(formData)
      setEditing(false)
    })
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <input
            ref={inputRef}
            type="number"
            step="0.01"
            min="0"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave()
              if (e.key === "Escape") handleCancel()
            }}
            onBlur={(e) => {
              // Don't save/close if the blur was caused by clicking the delete button
              if (e.relatedTarget?.getAttribute("data-delete-btn")) return
              handleSave()
            }}
            disabled={isPending}
            className="w-20 bg-white border border-line rounded px-2 py-1.5 text-sm text-ink outline-none focus:border-paddy"
          />
          {price !== null && (
            <button
              type="button"
              data-delete-btn="true"
              onClick={handleDelete}
              disabled={isPending}
              title="Remove this price"
              className="p-1.5 rounded text-muted/50 hover:text-accent-red hover:bg-accent-red/5 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
        {error && <span className="text-accent-red text-xs">{error}</span>}
      </div>
    )
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="w-24 text-left px-2 py-1.5 rounded hover:bg-paddy/5 transition-colors group"
    >
      {price !== null ? (
        <span className="text-ink text-sm">Rs. {price.toFixed(2)}</span>
      ) : (
        <span className="text-muted/50 text-sm italic group-hover:text-muted">Not set</span>
      )}
    </button>
  )
}