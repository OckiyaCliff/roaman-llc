import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/admin/login")
  }

  // Verify admin status
  const { data: adminRecord } = await supabase
    .from("platform_admins")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single()

  if (!adminRecord) {
    redirect("/auth/admin/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminHeader />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
