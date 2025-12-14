import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function AdminStaffPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/admin/login")
  }

  const { data: staffMembers } = await supabase
    .from("hotel_staff")
    .select("*, hotels(name)")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hotel Staff</h1>
          <p className="text-muted-foreground">Manage staff accounts across all hotels</p>
        </div>
        <Button asChild>
          <Link href="/admin/staff/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Staff
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Staff Members ({staffMembers?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {staffMembers && staffMembers.length > 0 ? (
            <div className="space-y-4">
              {staffMembers.map((staff) => (
                <div
                  key={staff.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">User ID: {staff.user_id.slice(0, 8)}...</p>
                      <Badge variant={staff.is_active ? "default" : "secondary"}>
                        {staff.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {staff.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{(staff.hotels as any)?.name || "Unknown Hotel"}</p>
                  </div>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    Manage
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-12 text-muted-foreground">No staff members found</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
