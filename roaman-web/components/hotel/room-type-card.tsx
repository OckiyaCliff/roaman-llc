"use client"

import Image from "next/image"
import { Users, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { HotelRoomDetail } from "@/lib/types/database"

interface RoomTypeCardProps {
  roomType: HotelRoomDetail
  onSelect: (roomType: HotelRoomDetail) => void
}

export function RoomTypeCard({ roomType, onSelect }: RoomTypeCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const isAvailable = roomType.available_count > 0

  return (
    <Card className={!isAvailable ? "opacity-60" : ""}>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 aspect-[16/10] md:aspect-auto relative">
          <Image
            src={roomType.images?.[0] || "/placeholder.svg?height=300&width=400&query=hotel+room+bed"}
            alt={roomType.room_type_name}
            fill
            className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
          />
        </div>
        <CardContent className="flex-1 p-4 md:p-6">
          <div className="flex flex-col h-full">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="text-lg font-semibold">{roomType.room_type_name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Users className="h-4 w-4" />
                  <span>Up to {roomType.max_occupancy} guests</span>
                </div>
              </div>
              {isAvailable ? (
                <Badge variant="secondary">{roomType.available_count} available</Badge>
              ) : (
                <Badge variant="outline">Sold out</Badge>
              )}
            </div>

            {roomType.description && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{roomType.description}</p>
            )}

            {roomType.amenities && roomType.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {roomType.amenities.slice(0, 5).map((amenity) => (
                  <span key={amenity} className="inline-flex items-center text-xs text-muted-foreground">
                    <Check className="h-3 w-3 mr-1" />
                    {amenity.replace("-", " ")}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-auto flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold">{formatPrice(roomType.base_price)}</span>
                <span className="text-muted-foreground">/night</span>
              </div>
              <Button onClick={() => onSelect(roomType)} disabled={!isAvailable}>
                {isAvailable ? "Book Now" : "Unavailable"}
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
