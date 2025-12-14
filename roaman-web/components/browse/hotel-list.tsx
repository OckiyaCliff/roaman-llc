import { HotelCard } from "./hotel-card"
import type { PublicHotelAvailability } from "@/lib/types/database"

interface HotelListProps {
  hotels: PublicHotelAvailability[]
}

export function HotelList({ hotels }: HotelListProps) {
  if (hotels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 min-h-[300px]">
        <p className="text-lg font-medium mb-2">No hotels found</p>
        <p className="text-muted-foreground">
          There are no available hotels in this area right now. Try expanding your search radius.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {hotels.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
    </div>
  )
}
