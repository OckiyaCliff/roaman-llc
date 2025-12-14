"use client"

import { useEffect, useState } from "react"
import { useRealtimeBookings } from "@/lib/hooks/use-realtime-bookings"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface BookingNotificationProps {
  hotelId: string
}

export function BookingNotification({ hotelId }: BookingNotificationProps) {
  const { lastUpdate, newBookingCount, clearNewBookingCount, isConnected } = useRealtimeBookings(hotelId)
  const [recentBookings, setRecentBookings] = useState<Array<{ id: string; time: string }>>([])

  useEffect(() => {
    if (lastUpdate && lastUpdate.status === "pending") {
      setRecentBookings((prev) => [
        { id: lastUpdate.booking_id, time: new Date().toLocaleTimeString() },
        ...prev.slice(0, 4),
      ])
    }
  }, [lastUpdate])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {newBookingCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {newBookingCount}
            </Badge>
          )}
          <span className="sr-only">Booking notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="p-2 border-b">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm">New Bookings</span>
            <div className="flex items-center gap-1">
              <span className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-muted-foreground"}`} />
              <span className="text-xs text-muted-foreground">{isConnected ? "Live" : "..."}</span>
            </div>
          </div>
        </div>
        {recentBookings.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">No new bookings</div>
        ) : (
          recentBookings.map((booking) => (
            <DropdownMenuItem key={booking.id} asChild>
              <Link href="/hotel/bookings" onClick={clearNewBookingCount} className="cursor-pointer">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">New booking received</span>
                  <span className="text-xs text-muted-foreground">{booking.time}</span>
                </div>
              </Link>
            </DropdownMenuItem>
          ))
        )}
        {recentBookings.length > 0 && (
          <div className="p-2 border-t">
            <Link href="/hotel/bookings" onClick={clearNewBookingCount}>
              <Button variant="ghost" size="sm" className="w-full">
                View all bookings
              </Button>
            </Link>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
