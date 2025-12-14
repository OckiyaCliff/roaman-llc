"use client"

import { useRealtimeAvailability } from "@/lib/hooks/use-realtime-rooms"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface LiveAvailabilityBadgeProps {
  hotelId: string
  initialCount?: number
  className?: string
}

export function LiveAvailabilityBadge({ hotelId, initialCount, className }: LiveAvailabilityBadgeProps) {
  const { availableCount, isConnected } = useRealtimeAvailability(hotelId)

  const count = availableCount ?? initialCount ?? 0

  if (count === 0) return null

  return (
    <Badge className={cn("bg-success text-success-foreground", className)}>
      <span className={cn("mr-1.5 h-1.5 w-1.5 rounded-full", isConnected ? "bg-white animate-pulse" : "bg-white/60")} />
      {count} {count === 1 ? "room" : "rooms"} left
    </Badge>
  )
}
