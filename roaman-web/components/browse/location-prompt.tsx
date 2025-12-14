"use client"

import { Button } from "@/components/ui/button"
import { MapPin, RefreshCw } from "lucide-react"

interface LocationPromptProps {
  onRequestLocation: () => void
  permissionDenied: boolean
  error?: string | null
}

export function LocationPrompt({ onRequestLocation, permissionDenied, error }: LocationPromptProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto min-h-[400px]">
      <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-6">
        <MapPin className="h-8 w-8" />
      </div>

      <h2 className="text-2xl font-bold mb-3">Enable Location Access</h2>

      {permissionDenied ? (
        <>
          <p className="text-muted-foreground mb-6">
            Location access was denied. To see hotels near you, please enable location permissions in your browser
            settings and try again.
          </p>
          <Button onClick={onRequestLocation}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </>
      ) : error ? (
        <>
          <p className="text-muted-foreground mb-6">We could not determine your location. Please try again.</p>
          <Button onClick={onRequestLocation}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </>
      ) : (
        <>
          <p className="text-muted-foreground mb-6">
            Roaman uses your location to show available hotels, lodges, and apartments near you. Your location is never
            stored or shared.
          </p>
          <Button onClick={onRequestLocation}>
            <MapPin className="mr-2 h-4 w-4" />
            Share My Location
          </Button>
        </>
      )}
    </div>
  )
}
