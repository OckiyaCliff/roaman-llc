"use client"

import useSWR from "swr"
import type { PublicHotelAvailability } from "@/lib/types/database"

interface NearbyHotelsParams {
  latitude: number | null
  longitude: number | null
  radius?: number
  limit?: number
}

async function fetchNearbyHotels(url: string): Promise<PublicHotelAvailability[]> {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch hotels")
  return res.json()
}

export function useNearbyHotels({ latitude, longitude, radius = 10, limit = 50 }: NearbyHotelsParams) {
  const shouldFetch = latitude !== null && longitude !== null

  const { data, error, isLoading, mutate } = useSWR<PublicHotelAvailability[]>(
    shouldFetch ? `/api/hotels/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}&limit=${limit}` : null,
    fetchNearbyHotels,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 30000, // Refresh every 30 seconds for real-time availability
    },
  )

  return {
    hotels: data ?? [],
    isLoading: shouldFetch ? isLoading : false,
    error,
    refresh: mutate,
  }
}
