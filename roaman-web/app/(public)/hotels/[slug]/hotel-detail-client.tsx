"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, MapPin, Star, Phone, Mail, Globe, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HotelGallery } from "@/components/hotel/hotel-gallery"
import { RoomTypeCard } from "@/components/hotel/room-type-card"
import { BookingForm } from "@/components/hotel/booking-form"
import type { Hotel, HotelRoomDetail } from "@/lib/types/database"

interface HotelDetailClientProps {
  hotel: Hotel
  roomTypes: HotelRoomDetail[]
}

export function HotelDetailClient({ hotel, roomTypes }: HotelDetailClientProps) {
  const [selectedRoomType, setSelectedRoomType] = useState<HotelRoomDetail | null>(null)
  const [bookingOpen, setBookingOpen] = useState(false)

  const handleRoomSelect = (roomType: HotelRoomDetail) => {
    setSelectedRoomType(roomType)
    setBookingOpen(true)
  }

  const totalAvailable = roomTypes.reduce((sum, rt) => sum + rt.available_count, 0)

  return (
    <div className="container max-w-screen-xl px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/browse">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Browse
        </Link>
      </Button>

      {/* Gallery */}
      <HotelGallery images={hotel.images || []} hotelName={hotel.name} />

      {/* Hotel Info */}
      <div className="mt-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">{hotel.name}</h1>
                <div className="flex items-center gap-3 mt-2 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {hotel.address}, {hotel.city}
                    </span>
                  </div>
                  {hotel.star_rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-current" />
                      <span>{hotel.star_rating} Star</span>
                    </div>
                  )}
                </div>
              </div>
              {totalAvailable > 0 && (
                <Badge className="bg-success text-success-foreground text-sm">{totalAvailable} rooms available</Badge>
              )}
            </div>
          </div>

          {/* Description */}
          {hotel.description && (
            <div>
              <h2 className="text-lg font-semibold mb-2">About</h2>
              <p className="text-muted-foreground">{hotel.description}</p>
            </div>
          )}

          {/* Amenities */}
          {hotel.amenities && hotel.amenities.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {hotel.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-success" />
                    <span className="capitalize">{amenity.replace("-", " ")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Room Types */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Available Rooms</h2>
            <div className="space-y-4">
              {roomTypes.length > 0 ? (
                roomTypes.map((roomType) => (
                  <RoomTypeCard key={roomType.room_type_id} roomType={roomType} onSelect={handleRoomSelect} />
                ))
              ) : (
                <p className="text-muted-foreground">No room information available.</p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-6">
            <div className="p-6 border rounded-lg space-y-4">
              <h3 className="font-semibold">Contact</h3>
              {hotel.phone && (
                <a
                  href={`tel:${hotel.phone}`}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Phone className="h-4 w-4" />
                  {hotel.phone}
                </a>
              )}
              {hotel.email && (
                <a
                  href={`mailto:${hotel.email}`}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Mail className="h-4 w-4" />
                  {hotel.email}
                </a>
              )}
              {hotel.website && (
                <a
                  href={hotel.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Globe className="h-4 w-4" />
                  Website
                </a>
              )}
            </div>

            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold mb-2">Location</h3>
              <p className="text-sm text-muted-foreground">
                {hotel.address}
                <br />
                {hotel.city}, {hotel.state}
                <br />
                {hotel.country}
              </p>
              {hotel.latitude && hotel.longitude && (
                <Button variant="outline" size="sm" className="mt-4 w-full bg-transparent" asChild>
                  <a
                    href={`https://www.google.com/maps?q=${hotel.latitude},${hotel.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Open in Maps
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Dialog */}
      {selectedRoomType && (
        <BookingForm hotel={hotel} roomType={selectedRoomType} open={bookingOpen} onOpenChange={setBookingOpen} />
      )}
    </div>
  )
}
