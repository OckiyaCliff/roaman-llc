import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Shield } from "lucide-react"

export default async function AdminsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/admin/login")
  }

  // Check if current user is super_admin
  const { data: currentAdmin } = await supabase.from("platform_admins").select("role").eq("user_id", user.id).single()

  const isSuperAdmin = currentAdmin?.role === "super_admin"

  const { data: admins } = await supabase.from("platform_admins").select("*").order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Platform Admins</h1>
          <p className="text-muted-foreground">Manage administrator accounts</p>
        </div>
        {isSuperAdmin && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Admin
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Administrators ({admins?.length || 0})</CardTitle>
          <CardDescription>Users with platform administrative access</CardDescription>
        </CardHeader>
        <CardContent>
          {admins && admins.length > 0 ? (
            <div className="space-y-4">
              {admins.map((admin) => (
                <div key={admin.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">Admin {admin.user_id.slice(0, 8)}...</p>
                        {admin.user_id === user.id && (
                          <Badge variant="outline" className="text-xs">
                            You
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={admin.role === "super_admin" ? "default" : "secondary"}
                          className="capitalize text-xs"
                        >
                          {admin.role.replace("_", " ")}
                        </Badge>
                        <Badge variant={admin.is_active ? "default" : "outline"} className="text-xs">
                          {admin.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {isSuperAdmin && admin.user_id !== user.id && (
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Manage
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-12 text-muted-foreground">No administrators found</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
