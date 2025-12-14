"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { RealtimeChannel } from "@supabase/supabase-js"

export interface BookingUpdate {
  booking_id: string
  hotel_id: string
  status: string
  updated_at: string
}

export function useRealtimeBookings(hotelId: string) {
  const [lastUpdate, setLastUpdate] = useState<BookingUpdate | null>(null)
  const [newBookingCount, setNewBookingCount] = useState(0)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    let channel: RealtimeChannel

    channel = supabase
      .channel(`bookings:${hotelId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookings",
          filter: `hotel_id=eq.${hotelId}`,
        },
        (payload) => {
          setLastUpdate({
            booking_id: payload.new.id,
            hotel_id: payload.new.hotel_id,
            status: payload.new.status,
            updated_at: payload.new.created_at,
          })
          setNewBookingCount((prev) => prev + 1)
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "bookings",
          filter: `hotel_id=eq.${hotelId}`,
        },
        (payload) => {
          setLastUpdate({
            booking_id: payload.new.id,
            hotel_id: payload.new.hotel_id,
            status: payload.new.status,
            updated_at: payload.new.updated_at,
          })
        },
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED")
      })

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [hotelId])

  const clearNewBookingCount = () => setNewBookingCount(0)

  return { lastUpdate, newBookingCount, clearNewBookingCount, isConnected }
}
