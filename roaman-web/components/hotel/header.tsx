"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { HotelSidebar } from "./sidebar"
import { BookingNotification } from "./booking-notification"
import { ThemeToggle } from "@/components/theme-toggle"

interface HotelHeaderProps {
  hotelName?: string
  hotelId?: string
}

export function HotelHeader({ hotelName, hotelId }: HotelHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-background px-4 lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <HotelSidebar />
        </SheetContent>
      </Sheet>
      <div className="flex-1">
        <h1 className="text-lg font-semibold truncate">{hotelName || "Hotel Dashboard"}</h1>
      </div>
      <div className="flex items-center gap-2">
        {hotelId && <BookingNotification hotelId={hotelId} />}
        <ThemeToggle />
      </div>
    </header>
  )
}
