"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useGeolocation } from "@/lib/hooks/use-geolocation"
import { useNearbyHotels } from "@/lib/hooks/use-nearby-hotels"
import { useRealtimeRooms } from "@/lib/hooks/use-realtime-rooms"
import { LocationPrompt } from "@/components/browse/location-prompt"
import { BrowseHeader } from "@/components/browse/browse-header"
import { HotelList } from "@/components/browse/hotel-list"
import { HotelMap } from "@/components/browse/hotel-map"
import { RealtimeIndicator } from "@/components/browse/realtime-indicator"
import { Skeleton } from "@/components/ui/skeleton"

function BrowseContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const viewParam = searchParams.get("view")

  const [view, setView] = useState<"list" | "map">((viewParam as "list" | "map") || "list")
  const [radius, setRadius] = useState(10)

  const { latitude, longitude, loading: locationLoading, error, permissionDenied, requestLocation } = useGeolocation()

  const { hotels, isLoading: hotelsLoading, refresh } = useNearbyHotels({ latitude, longitude, radius })

  const { lastUpdate, isConnected } = useRealtimeRooms()

  // Auto-refresh when room status changes
  useEffect(() => {
    if (lastUpdate) {
      refresh()
    }
  }, [lastUpdate, refresh])

  const handleViewChange = (newView: "list" | "map") => {
    setView(newView)
    router.push(`/browse?view=${newView}`, { scroll: false })
  }

  // Show location prompt if we don't have coordinates
  if (!latitude || !longitude) {
    if (locationLoading) {
      return (
        <div className="container max-w-screen-2xl px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-muted mb-6" />
              <div className="h-6 w-48 bg-muted rounded mb-3" />
              <div className="h-4 w-64 bg-muted rounded" />
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="container max-w-screen-2xl px-4 py-8">
        <LocationPrompt onRequestLocation={requestLocation} permissionDenied={permissionDenied} error={error} />
      </div>
    )
  }

  return (
    <div className="container max-w-screen-2xl px-4 py-8">
      <div className="flex justify-end mb-2">
        <RealtimeIndicator isConnected={isConnected} />
      </div>

      <BrowseHeader
        hotelCount={hotels.length}
        view={view}
        onViewChange={handleViewChange}
        radius={radius}
        onRadiusChange={setRadius}
        onRefresh={refresh}
        isLoading={hotelsLoading}
      />

      {hotelsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[16/10] rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-5 w-1/3" />
            </div>
          ))}
        </div>
      ) : view === "list" ? (
        <HotelList hotels={hotels} />
      ) : (
        <HotelMap
          hotels={hotels}
          userLocation={latitude && longitude ? { latitude, longitude } : null}
          onHotelSelect={(hotel) => router.push(`/hotels/${hotel.slug}`)}
        />
      )}
    </div>
  )
}

export default function BrowsePage() {
  return (
    <Suspense
      fallback={
        <div className="container max-w-screen-2xl px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Skeleton className="h-16 w-16 rounded-full mb-6" />
            <Skeleton className="h-6 w-48 mb-3" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      }
    >
      <BrowseContent />
    </Suspense>
  )
}
