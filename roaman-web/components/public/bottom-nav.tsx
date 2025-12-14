"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, MapPin, Info } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/browse", icon: Search, label: "Browse" },
  { href: "/browse?view=map", icon: MapPin, label: "Map" },
  { href: "/about", icon: Info, label: "About" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href.split("?")[0]))

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
