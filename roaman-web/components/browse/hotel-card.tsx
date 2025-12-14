import Link from "next/link"
import Image from "next/image"
import { MapPin, Star, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { LiveAvailabilityBadge } from "./live-availability-badge"
import type { PublicHotelAvailability } from "@/lib/types/database"

interface HotelCardProps {
  hotel: PublicHotelAvailability
}

export function HotelCard({ hotel }: HotelCardProps) {
  const formatPrice = (price: number | null) => {
    if (!price) return "N/A"
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDistance = (km: number | undefined) => {
    if (!km) return ""
    if (km < 1) return `${Math.round(km * 1000)}m away`
    return `${km.toFixed(1)}km away`
  }

  return (
    <Link href={`/hotels/${hotel.slug}`}>
      <Card className="overflow-hidden hover:bg-accent/50 transition-colors group">
        <div className="aspect-[16/10] relative overflow-hidden bg-muted">
          <Image
            src={hotel.thumbnail || "/placeholder.svg?height=400&width=600&query=hotel+exterior+building"}
            alt={hotel.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <LiveAvailabilityBadge
            hotelId={hotel.id}
            initialCount={hotel.available_rooms}
            className="absolute top-3 left-3"
          />
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-lg line-clamp-1">{hotel.name}</h3>
            {hotel.star_rating && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground flex-shrink-0">
                <Star className="h-3.5 w-3.5 fill-current" />
                {hotel.star_rating}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="line-clamp-1">
              {hotel.city}
              {hotel.distance_km ? ` · ${formatDistance(hotel.distance_km)}` : ""}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-semibold">{formatPrice(hotel.min_price)}</span>
              <span className="text-sm text-muted-foreground">/night</span>
            </div>
            {hotel.amenities && hotel.amenities.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                {hotel.amenities.slice(0, 2).join(" · ")}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
