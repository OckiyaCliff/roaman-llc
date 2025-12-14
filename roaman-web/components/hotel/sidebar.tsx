"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BedDouble,
  CalendarDays,
  Settings,
  LogOut,
  DoorOpen,
  CreditCard,
  BarChart3,
} from "lucide-react"

const navItems = [
  { href: "/hotel/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/hotel/rooms", icon: BedDouble, label: "Rooms" },
  { href: "/hotel/bookings", icon: CalendarDays, label: "Bookings" },
  { href: "/hotel/availability", icon: DoorOpen, label: "Availability" },
  { href: "/hotel/pricing", icon: CreditCard, label: "Pricing" },
  { href: "/hotel/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/hotel/settings", icon: Settings, label: "Settings" },
]

export function HotelSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/hotel/login")
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar hidden lg:block">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-14 items-center border-b border-sidebar-border px-4">
          <Link href="/hotel/dashboard" className="flex items-center gap-2">
            <Logo />
            <span className="text-xs text-muted-foreground">Hotel</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  )
}
