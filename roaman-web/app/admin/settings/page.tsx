"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Globe, Bell, Shield, Database } from "lucide-react"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    platformName: "Roaman",
    supportEmail: "support@roaman.com",
    maxSearchRadius: 50,
    autoReleaseHours: 2,
    maintenanceMode: false,
    newHotelRegistration: true,
    emailNotifications: true,
    bookingAlerts: true,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Platform Settings</h1>
        <p className="text-muted-foreground">Configure global platform settings and preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">General Settings</CardTitle>
            </div>
            <CardDescription>Basic platform configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platformName">Platform Name</Label>
              <Input
                id="platformName"
                value={settings.platformName}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxRadius">Max Search Radius (km)</Label>
              <Input
                id="maxRadius"
                type="number"
                value={settings.maxSearchRadius}
                onChange={(e) => setSettings({ ...settings, maxSearchRadius: Number.parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="autoRelease">Auto-Release Period (hours)</Label>
              <Input
                id="autoRelease"
                type="number"
                value={settings.autoReleaseHours}
                onChange={(e) => setSettings({ ...settings, autoReleaseHours: Number.parseInt(e.target.value) })}
              />
              <p className="text-xs text-muted-foreground">
                Rooms automatically become available after this period if no check-in
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Access Control</CardTitle>
            </div>
            <CardDescription>Manage platform access and registration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-xs text-muted-foreground">Disable public access temporarily</p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Hotel Registration</Label>
                <p className="text-xs text-muted-foreground">Allow new hotels to sign up</p>
              </div>
              <Switch
                checked={settings.newHotelRegistration}
                onCheckedChange={(checked) => setSettings({ ...settings, newHotelRegistration: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Notifications</CardTitle>
            </div>
            <CardDescription>Configure notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive admin alerts via email</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Booking Alerts</Label>
                <p className="text-xs text-muted-foreground">Get notified of booking issues</p>
              </div>
              <Switch
                checked={settings.bookingAlerts}
                onCheckedChange={(checked) => setSettings({ ...settings, bookingAlerts: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Database</CardTitle>
            </div>
            <CardDescription>Database maintenance and backups</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4 bg-muted/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Last Backup</span>
                <span className="text-sm text-muted-foreground">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database Size</span>
                <span className="text-sm text-muted-foreground">245 MB</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                Create Backup
              </Button>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                View Backups
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  )
}
