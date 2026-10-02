import { redirect } from "next/navigation"
import { Sidebar } from "@/components/shared/Sidebar"
import { getSession } from "@/lib/auth/session"

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const sessionUserId = await getSession()

  if (!sessionUserId) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar username="Admin" />
      <main className="flex-1 min-w-0 bg-paper">{children}</main>
    </div>
  )
}
