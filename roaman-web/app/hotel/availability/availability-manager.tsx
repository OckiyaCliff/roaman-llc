"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRealtimeRooms } from "@/lib/hooks/use-realtime-rooms"
import { RealtimeIndicator } from "@/components/browse/realtime-indicator"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { CheckCircle, XCircle, Clock, Wrench, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Room {
  id: string
  room_number: string
  floor: number | null
  status: string
  room_types: { name: string } | null
}

interface AvailabilityManagerProps {
  rooms: Room[]
  hotelId: string
}

const statusConfig = {
  available: { label: "Available", icon: CheckCircle, color: "bg-success text-success-foreground" },
  occupied: { label: "Occupied", icon: XCircle, color: "bg-destructive text-destructive-foreground" },
  reserved: { label: "Reserved", icon: Clock, color: "bg-yellow-500 text-white" },
  maintenance: { label: "Maintenance", icon: Wrench, color: "bg-orange-500 text-white" },
  cleaning: { label: "Cleaning", icon: Sparkles, color: "bg-blue-500 text-white" },
}

export function AvailabilityManager({ rooms: initialRooms, hotelId }: AvailabilityManagerProps) {
  const [rooms, setRooms] = useState(initialRooms)
  const [updating, setUpdating] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>("all")
  const { toast } = useToast()

  const { lastUpdate, isConnected } = useRealtimeRooms(hotelId)

  // Auto-update room status when changes come in from other sessions
  useEffect(() => {
    if (lastUpdate) {
      setRooms((currentRooms) =>
        currentRooms.map((room) => (room.id === lastUpdate.room_id ? { ...room, status: lastUpdate.status } : room)),
      )
      toast({
        title: "Room Updated",
        description: `Room ${lastUpdate.room_number} is now ${lastUpdate.status}`,
      })
    }
  }, [lastUpdate, toast])

  const handleStatusChange = async (roomId: string, newStatus: string) => {
    setUpdating(roomId)
    const supabase = createClient()

    const { error } = await supabase.from("rooms").update({ status: newStatus }).eq("id", roomId)

    if (!error) {
      setRooms(rooms.map((room) => (room.id === roomId ? { ...room, status: newStatus } : room)))
    } else {
      toast({
        title: "Error",
        description: "Failed to update room status",
        variant: "destructive",
      })
    }

    setUpdating(null)
  }

  const filteredRooms = filter === "all" ? rooms : rooms.filter((room) => room.status === filter)

  const statusCounts = rooms.reduce(
    (acc, room) => {
      acc[room.status] = (acc[room.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <RealtimeIndicator isConnected={isConnected} />
      </div>

      {/* Status Summary */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
          className={filter !== "all" ? "bg-transparent" : ""}
        >
          All ({rooms.length})
        </Button>
        {Object.entries(statusConfig).map(([key, config]) => (
          <Button
            key={key}
            variant={filter === key ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(key)}
            className={filter !== key ? "bg-transparent" : ""}
          >
            <config.icon className="mr-1 h-3 w-3" />
            {config.label} ({statusCounts[key] || 0})
          </Button>
        ))}
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredRooms.map((room) => {
          const status = statusConfig[room.status as keyof typeof statusConfig]
          const StatusIcon = status?.icon || CheckCircle
          const isRecentlyUpdated = lastUpdate?.room_id === room.id

          return (
            <Card key={room.id} className={cn("relative transition-all", isRecentlyUpdated && "ring-2 ring-primary")}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-lg">{room.room_number}</p>
                    <p className="text-xs text-muted-foreground">{room.room_types?.name || "Standard"}</p>
                    {room.floor && <p className="text-xs text-muted-foreground">Floor {room.floor}</p>}
                  </div>
                  <Badge className={cn("text-xs", status?.color)}>
                    <StatusIcon className="mr-1 h-3 w-3" />
                    {status?.label}
                  </Badge>
                </div>

                <Select
                  value={room.status}
                  onValueChange={(value) => handleStatusChange(room.id, value)}
                  disabled={updating === room.id}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Change status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <config.icon className="h-3 w-3" />
                          {config.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">No rooms found with this status</div>
      )}
    </div>
  )
}
