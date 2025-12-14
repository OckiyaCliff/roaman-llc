"use client"

import { useEffect, useRef } from "react"
import type { PublicHotelAvailability } from "@/lib/types/database"

interface HotelMapProps {
  hotels: PublicHotelAvailability[]
  userLocation: { latitude: number; longitude: number } | null
  onHotelSelect?: (hotel: PublicHotelAvailability) => void
}

export function HotelMap({ hotels, userLocation, onHotelSelect }: HotelMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Map implementation would go here (Mapbox, Google Maps, or Leaflet)
    // For now, showing a placeholder
  }, [hotels, userLocation])

  return (
    <div ref={mapRef} className="w-full h-[500px] bg-muted rounded-lg flex items-center justify-center">
      <div className="text-center p-8">
        <p className="text-lg font-medium mb-2">Map View</p>
        <p className="text-muted-foreground text-sm mb-4">
          {hotels.length} hotels within range
          {userLocation && (
            <>
              <br />
              Your location: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
            </>
          )}
        </p>
        <div className="space-y-2 max-w-sm mx-auto">
          {hotels.slice(0, 5).map((hotel) => (
            <button
              key={hotel.id}
              onClick={() => onHotelSelect?.(hotel)}
              className="w-full p-3 text-left bg-background rounded-lg border hover:bg-accent transition-colors"
            >
              <p className="font-medium text-sm">{hotel.name}</p>
              <p className="text-xs text-muted-foreground">
                {hotel.distance_km ? `${hotel.distance_km.toFixed(1)}km · ` : ""}
                {hotel.available_rooms} rooms available
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
