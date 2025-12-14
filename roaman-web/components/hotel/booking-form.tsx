"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, Clock } from "lucide-react"
import { format, addHours, addDays } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import type { HotelRoomDetail, Hotel } from "@/lib/types/database"
import { cn } from "@/lib/utils"

interface BookingFormProps {
  hotel: Hotel
  roomType: HotelRoomDetail
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BookingForm({ hotel, roomType, open, onOpenChange }: BookingFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [stayType, setStayType] = useState<"hourly" | "nightly">("nightly")
  const [checkInDate, setCheckInDate] = useState<Date>(new Date())
  const [checkInTime, setCheckInTime] = useState("14:00")
  const [hours, setHours] = useState(3)
  const [nights, setNights] = useState(1)

  const [guestName, setGuestName] = useState("")
  const [guestEmail, setGuestEmail] = useState("")
  const [guestPhone, setGuestPhone] = useState("")
  const [specialRequests, setSpecialRequests] = useState("")

  const hourlyRate = roomType.base_price * 0.15
  const nightlyRate = roomType.base_price

  const calculateTotal = () => {
    if (stayType === "hourly") {
      return hourlyRate * hours
    }
    return nightlyRate * nights
  }

  const calculateCheckOut = () => {
    const checkIn = new Date(checkInDate)
    const [h, m] = checkInTime.split(":").map(Number)
    checkIn.setHours(h, m, 0, 0)

    if (stayType === "hourly") {
      return addHours(checkIn, hours)
    }
    return addDays(checkIn, nights)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const checkIn = new Date(checkInDate)
    const [h, m] = checkInTime.split(":").map(Number)
    checkIn.setHours(h, m, 0, 0)

    try {
      // First get an available room of this type
      const roomsRes = await fetch(`/api/hotels/${hotel.slug}/rooms?roomTypeId=${roomType.room_type_id}`)
      const rooms = await roomsRes.json()

      if (!rooms || rooms.length === 0) {
        setError("No rooms available for this type. Please try another room type.")
        setIsSubmitting(false)
        return
      }

      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: rooms[0].id,
          checkIn: checkIn.toISOString(),
          checkOut: calculateCheckOut().toISOString(),
          guestName,
          guestEmail,
          guestPhone,
          stayType,
          totalAmount: calculateTotal(),
          specialRequests: specialRequests || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to create booking")
        setIsSubmitting(false)
        return
      }

      // Redirect to confirmation page
      router.push(`/booking/confirmation/${data.bookingReference}`)
    } catch {
      setError("An error occurred. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book {roomType.room_type_name}</DialogTitle>
          <DialogDescription>{hotel.name}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Stay Type */}
          <div className="space-y-3">
            <Label>Stay Type</Label>
            <RadioGroup
              value={stayType}
              onValueChange={(v) => setStayType(v as "hourly" | "nightly")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hourly" id="hourly" />
                <Label htmlFor="hourly" className="cursor-pointer">
                  Hourly ({formatPrice(hourlyRate)}/hr)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nightly" id="nightly" />
                <Label htmlFor="nightly" className="cursor-pointer">
                  Nightly ({formatPrice(nightlyRate)}/night)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Check-in Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Check-in Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(checkInDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkInDate}
                    onSelect={(date) => date && setCheckInDate(date)}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Check-in Time</Label>
              <Select value={checkInTime} onValueChange={setCheckInTime}>
                <SelectTrigger>
                  <Clock className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => {
                    const time = `${i.toString().padStart(2, "0")}:00`
                    return (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label>{stayType === "hourly" ? "Duration (hours)" : "Number of nights"}</Label>
            {stayType === "hourly" ? (
              <Select value={hours.toString()} onValueChange={(v) => setHours(Number.parseInt(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2, 3, 4, 5, 6].map((h) => (
                    <SelectItem key={h} value={h.toString()}>
                      {h} hours
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Select value={nights.toString()} onValueChange={(v) => setNights(Number.parseInt(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n} {n === 1 ? "night" : "nights"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <p className="text-sm text-muted-foreground">Check-out: {format(calculateCheckOut(), "PPP p")}</p>
          </div>

          {/* Guest Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="guestName">Full Name</Label>
              <Input
                id="guestName"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guestEmail">Email</Label>
              <Input
                id="guestEmail"
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="john@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guestPhone">Phone Number</Label>
              <Input
                id="guestPhone"
                type="tel"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder="+234 800 000 0000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialRequests">Special Requests (optional)</Label>
              <Textarea
                id="specialRequests"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Any special requirements..."
                rows={2}
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          {/* Total */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatPrice(calculateTotal())}</span>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Confirm Booking"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
