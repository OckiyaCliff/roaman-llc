"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { RealtimeChannel } from "@supabase/supabase-js"

export interface RoomUpdate {
  room_id: string
  hotel_id: string
  room_number: string
  status: "available" | "occupied" | "reserved" | "maintenance"
  updated_at: string
}

export function useRealtimeRooms(hotelId?: string) {
  const [lastUpdate, setLastUpdate] = useState<RoomUpdate | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    let channel: RealtimeChannel

    const setupSubscription = () => {
      const channelName = hotelId ? `rooms:hotel:${hotelId}` : "rooms:all"

      channel = supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "rooms",
            ...(hotelId ? { filter: `hotel_id=eq.${hotelId}` } : {}),
          },
          (payload) => {
            const update: RoomUpdate = {
              room_id: payload.new.id,
              hotel_id: payload.new.hotel_id,
              room_number: payload.new.room_number,
              status: payload.new.status,
              updated_at: payload.new.updated_at,
            }
            setLastUpdate(update)
          },
        )
        .subscribe((status) => {
          setIsConnected(status === "SUBSCRIBED")
        })
    }

    setupSubscription()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [hotelId])

  return { lastUpdate, isConnected }
}

export function useRealtimeAvailability(hotelId: string) {
  const [availableCount, setAvailableCount] = useState<number | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const fetchCount = useCallback(async () => {
    const supabase = createClient()
    const { count } = await supabase
      .from("rooms")
      .select("*", { count: "exact", head: true })
      .eq("hotel_id", hotelId)
      .eq("status", "available")

    setAvailableCount(count)
  }, [hotelId])

  useEffect(() => {
    fetchCount()

    const supabase = createClient()
    const channel = supabase
      .channel(`availability:${hotelId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rooms",
          filter: `hotel_id=eq.${hotelId}`,
        },
        () => {
          fetchCount()
        },
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED")
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [hotelId, fetchCount])

  return { availableCount, isConnected, refetch: fetchCount }
}
