"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, BedDouble, CalendarDays, DoorOpen, Settings } from "lucide-react"

const navItems = [
  { href: "/hotel/dashboard", icon: LayoutDashboard, label: "Home" },
  { href: "/hotel/rooms", icon: BedDouble, label: "Rooms" },
  { href: "/hotel/bookings", icon: CalendarDays, label: "Bookings" },
  { href: "/hotel/availability", icon: DoorOpen, label: "Status" },
  { href: "/hotel/settings", icon: Settings, label: "Settings" },
]

export function HotelMobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background lg:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-full h-full text-xs transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "stroke-[2.5px]")} />
              <span className={cn(isActive && "font-medium")}>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
