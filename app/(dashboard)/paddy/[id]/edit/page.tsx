import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { getPaddyEntryById } from "@/lib/services/paddy/paddyService"
import { PaddyForm } from "@/components/forms/paddyForm"

export default async function EditPaddyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const entry = await getPaddyEntryById(id)

  if (!entry) notFound()

  return (
    <div className="p-10">
      <Link
        href="/paddy"
        className="inline-flex items-center gap-1.5 text-muted text-sm hover:text-ink transition-colors mb-6"
      >
        <ArrowLeft size={15} />
        Back to Paddy Stock
      </Link>

      <h1 className="font-serif text-ink text-2xl mb-1">Edit Paddy Entry</h1>
      <p className="text-muted text-sm mb-8">Update this paddy purchase record.</p>
      <PaddyForm initialData={entry} />
    </div>
  )
}