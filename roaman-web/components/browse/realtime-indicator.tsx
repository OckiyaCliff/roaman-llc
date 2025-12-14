"use client"

import { cn } from "@/lib/utils"

interface RealtimeIndicatorProps {
  isConnected: boolean
  className?: string
}

export function RealtimeIndicator({ isConnected, className }: RealtimeIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-2 text-xs", className)}>
      <span
        className={cn("h-2 w-2 rounded-full", isConnected ? "bg-green-500 animate-pulse" : "bg-muted-foreground")}
      />
      <span className="text-muted-foreground">{isConnected ? "Live updates" : "Connecting..."}</span>
    </div>
  )
}
