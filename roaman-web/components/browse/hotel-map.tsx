"use client"

import { useEffect, useRef, useState } from "react"
import type { PublicHotelAvailability } from "@/lib/types/database"

interface HotelMapProps {
  hotels: PublicHotelAvailability[]
  userLocation: { latitude: number; longitude: number } | null
  onHotelSelect?: (hotel: PublicHotelAvailability) => void
}

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

export function HotelMap({ hotels, userLocation, onHotelSelect }: HotelMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      setError("Google Maps API key not configured")
      return
    }

    if (window.google?.maps) {
      setIsLoaded(true)
      return
    }

    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript) {
      const checkLoaded = setInterval(() => {
        if (window.google?.maps) {
          setIsLoaded(true)
          clearInterval(checkLoaded)
        }
      }, 100)
      return () => clearInterval(checkLoaded)
    }

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => setIsLoaded(true)
    script.onerror = () => setError("Failed to load Google Maps")
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google?.maps) return

    const center = userLocation
      ? { lat: userLocation.latitude, lng: userLocation.longitude }
      : hotels.length > 0 && hotels[0].latitude && hotels[0].longitude
        ? { lat: Number(hotels[0].latitude), lng: Number(hotels[0].longitude) }
        : { lat: 6.5244, lng: 3.3792 }

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 13,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      })
    }

    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    if (userLocation) {
      const userMarker = new window.google.maps.Marker({
        position: { lat: userLocation.latitude, lng: userLocation.longitude },
        map: mapInstanceRef.current,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#3b82f6",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
        title: "Your Location",
      })
      markersRef.current.push(userMarker)
    }

    hotels.forEach((hotel) => {
      if (!hotel.latitude || !hotel.longitude) return

      const marker = new window.google.maps.Marker({
        position: { lat: Number(hotel.latitude), lng: Number(hotel.longitude) },
        map: mapInstanceRef.current,
        title: hotel.name,
      })

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="font-weight: 600; margin-bottom: 4px;">${hotel.name}</h3>
            <p style="font-size: 12px; color: #666; margin-bottom: 4px;">${hotel.city}</p>
            <p style="font-size: 12px; color: #16a34a; font-weight: 500;">${hotel.available_rooms} rooms available</p>
            ${hotel.distance_km ? `<p style="font-size: 12px; color: #666;">${hotel.distance_km.toFixed(1)}km away</p>` : ""}
          </div>
        `,
      })

      marker.addListener("click", () => {
        infoWindow.open(mapInstanceRef.current, marker)
        if (onHotelSelect) {
          onHotelSelect(hotel)
        }
      })

      markersRef.current.push(marker)
    })

    if (hotels.length > 0 || userLocation) {
      const bounds = new window.google.maps.LatLngBounds()
      if (userLocation) {
        bounds.extend({ lat: userLocation.latitude, lng: userLocation.longitude })
      }
      hotels.forEach((hotel) => {
        if (hotel.latitude && hotel.longitude) {
          bounds.extend({ lat: Number(hotel.latitude), lng: Number(hotel.longitude) })
        }
      })
      mapInstanceRef.current.fitBounds(bounds)
    }
  }, [isLoaded, hotels, userLocation, onHotelSelect])

  if (error) {
    return (
      <div className="w-full h-[500px] bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-lg font-medium mb-2 text-destructive">Map Error</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-[500px] bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    )
  }

  return <div ref={mapRef} className="w-full h-[500px] rounded-lg" />
}
