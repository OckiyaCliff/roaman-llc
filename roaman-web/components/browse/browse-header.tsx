"use client"

import { MapPin, List, Map, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BrowseHeaderProps {
  hotelCount: number
  view: "list" | "map"
  onViewChange: (view: "list" | "map") => void
  radius: number
  onRadiusChange: (radius: number) => void
  onRefresh: () => void
  isLoading: boolean
  locationName?: string
}

export function BrowseHeader({
  hotelCount,
  view,
  onViewChange,
  radius,
  onRadiusChange,
  onRefresh,
  isLoading,
  locationName,
}: BrowseHeaderProps) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Available Now</h1>
          <p className="text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="h-4 w-4" />
            {locationName || "Near you"} · {hotelCount} {hotelCount === 1 ? "hotel" : "hotels"}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <Select value={radius.toString()} onValueChange={(v) => onRadiusChange(Number.parseInt(v))}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Distance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">Within 5km</SelectItem>
            <SelectItem value="10">Within 10km</SelectItem>
            <SelectItem value="20">Within 20km</SelectItem>
            <SelectItem value="50">Within 50km</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center border rounded-lg p-1">
          <Button
            variant={view === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onViewChange("list")}
            className="h-8"
          >
            <List className="h-4 w-4 mr-1" />
            List
          </Button>
          <Button
            variant={view === "map" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onViewChange("map")}
            className="h-8"
          >
            <Map className="h-4 w-4 mr-1" />
            Map
          </Button>
        </div>
      </div>
    </div>
  )
}
