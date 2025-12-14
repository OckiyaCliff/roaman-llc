export interface Hotel {
  id: string
  name: string
  slug: string
  description: string | null
  address: string
  city: string
  state: string | null
  country: string
  latitude: number | null
  longitude: number | null
  phone: string | null
  email: string | null
  website: string | null
  star_rating: number | null
  amenities: string[]
  images: string[]
  thumbnail: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface RoomType {
  id: string
  hotel_id: string
  name: string
  description: string | null
  base_price: number
  max_occupancy: number
  amenities: string[]
  images: string[]
  created_at: string
  updated_at: string
}

export interface Room {
  id: string
  hotel_id: string
  room_type_id: string
  room_number: string
  floor: number | null
  status: "available" | "occupied" | "reserved" | "maintenance" | "cleaning"
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  booking_reference: string
  hotel_id: string
  room_id: string
  room_type_id: string
  guest_name: string
  guest_email: string
  guest_phone: string
  check_in: string
  check_out: string
  stay_type: "hourly" | "nightly" | "extended"
  total_amount: number
  payment_status: "pending" | "paid" | "refunded" | "failed"
  booking_status: "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled" | "no_show"
  special_requests: string | null
  created_at: string
  updated_at: string
}

export interface HotelStaff {
  id: string
  user_id: string
  hotel_id: string
  role: "owner" | "manager" | "staff"
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PlatformAdmin {
  id: string
  user_id: string
  role: "super_admin" | "admin" | "support"
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PricingRule {
  id: string
  hotel_id: string
  room_type_id: string | null
  name: string
  rule_type: "hourly" | "nightly" | "weekly" | "monthly" | "surge" | "discount"
  price: number
  min_hours: number | null
  max_hours: number | null
  start_date: string | null
  end_date: string | null
  days_of_week: number[]
  is_active: boolean
  priority: number
  created_at: string
  updated_at: string
}

// View types for public API
export interface PublicHotelAvailability {
  id: string
  name: string
  slug: string
  description: string | null
  address: string
  city: string
  state: string | null
  country: string
  latitude: number | null
  longitude: number | null
  star_rating: number | null
  amenities: string[]
  thumbnail: string | null
  images: string[]
  available_rooms: number
  min_price: number | null
  max_price: number | null
  distance_km?: number
}

export interface HotelRoomDetail {
  room_type_id: string
  hotel_id: string
  room_type_name: string
  description: string | null
  base_price: number
  max_occupancy: number
  amenities: string[]
  images: string[]
  available_count: number
}
