import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { HotelSidebar } from "@/components/hotel/sidebar"
import { HotelMobileNav } from "@/components/hotel/mobile-nav"
import { HotelHeader } from "@/components/hotel/header"

export default async function HotelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/hotel/login")
  }

  // Get hotel staff record to verify access
  const { data: staffRecord } = await supabase
    .from("hotel_staff")
    .select("*, hotels(name)")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single()

  const hotelName = (staffRecord?.hotels as any)?.name

  return (
    <div className="min-h-screen bg-background">
      <HotelSidebar />
      <div className="lg:pl-64">
        <HotelHeader hotelName={hotelName} />
        <main className="p-4 md:p-6 pb-20 lg:pb-6">{children}</main>
      </div>
      <HotelMobileNav />
    </div>
  )
}
