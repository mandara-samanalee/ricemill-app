import { Sidebar } from "@/components/shared/Sidebar"
import { getSession } from "@/lib/auth/session"
import { prisma } from "@/lib/prisma/client"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userId = await getSession()
  if (!userId) redirect("/login")

  const user = await prisma.user.findUnique({ where: { id: Number(userId) } })
  if (!user) redirect("/login")

  return (
    <div className="flex">
      <Sidebar username={user.username} />
      <main className="flex-1 min-h-screen">{children}</main>
    </div>
  )
}