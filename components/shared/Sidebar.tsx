'use client'

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Receipt, Wheat, Tag, LogOut } from "lucide-react"
import { logout } from "@/app/login/login.actions"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/orders", label: "Rice Orders", icon: Receipt },
  { href: "/dashboard/paddy", label: "Paddy Stock", icon: Wheat },
  { href: "/dashboard/pricing", label: "Pricing", icon: Tag },
]

export function Sidebar({ username }: { username: string }) {
  const pathname = usePathname()

  return (
    <aside className="w-66 shrink-0 bg-sidebar flex flex-col h-screen sticky top-0">
      <div className="flex items-center gap-2.5 px-5 py-6">
        <Image
          src="/logo.png"
          alt="RM Rice Mill"
          width={68}
          height={68}
          className="rounded-sm"
          style={{ width: "auto", height: "auto" }}
        />
        <span className="text-paper font-serif text-base">Apeksha Rice Mill</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors relative ${
                isActive
                  ? "bg-white/[0.06] text-paper"
                  : "text-paper/60 hover:text-paper hover:bg-white/[0.04]"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-paddy rounded-full" />
              )}
              <Icon size={17} strokeWidth={2} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 pb-5 pt-3 border-t border-white/10">
        <div className="px-3 py-2 text-paper/50 text-xs">Signed in as</div>
        <div className="px-3 pb-3 text-paper text-sm">{username}</div>
        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-paper/60 hover:text-paper hover:bg-white/[0.04] transition-colors"
          >
            <LogOut size={17} strokeWidth={2} />
            Log out
          </button>
        </form>
      </div>
    </aside>
  )
}