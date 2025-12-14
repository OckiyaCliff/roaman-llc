"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Download, Filter } from "lucide-react"

const mockAuditLogs = [
  {
    id: "1",
    action: "room.status_change",
    actor: "john@grandhotel.com",
    actorType: "hotel_staff",
    target: "Room 101",
    details: "Status changed from available to occupied",
    timestamp: "2024-01-15T14:32:00Z",
  },
  {
    id: "2",
    action: "booking.created",
    actor: "system",
    actorType: "system",
    target: "Booking #BK-ABC123",
    details: "New booking created for Grand Hotel",
    timestamp: "2024-01-15T14:28:00Z",
  },
  {
    id: "3",
    action: "hotel.approved",
    actor: "admin@roaman.com",
    actorType: "admin",
    target: "City Lodge",
    details: "Hotel approved and activated",
    timestamp: "2024-01-15T13:15:00Z",
  },
  {
    id: "4",
    action: "pricing.updated",
    actor: "manager@citylodge.com",
    actorType: "hotel_staff",
    target: "City Lodge",
    details: "Hourly rate updated to $45",
    timestamp: "2024-01-15T12:45:00Z",
  },
  {
    id: "5",
    action: "staff.created",
    actor: "admin@roaman.com",
    actorType: "admin",
    target: "jane@seasideinn.com",
    details: "New staff account created",
    timestamp: "2024-01-15T11:30:00Z",
  },
  {
    id: "6",
    action: "booking.cancelled",
    actor: "reception@grandhotel.com",
    actorType: "hotel_staff",
    target: "Booking #BK-XYZ789",
    details: "Booking cancelled - guest no-show",
    timestamp: "2024-01-15T10:20:00Z",
  },
]

const actionColors: Record<string, string> = {
  "room.status_change": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "booking.created": "bg-green-500/10 text-green-600 dark:text-green-400",
  "booking.cancelled": "bg-red-500/10 text-red-600 dark:text-red-400",
  "hotel.approved": "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  "pricing.updated": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "staff.created": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
}

const actorTypeColors: Record<string, string> = {
  admin: "bg-primary/10 text-primary",
  hotel_staff: "bg-secondary text-secondary-foreground",
  system: "bg-muted text-muted-foreground",
}

export default function AuditLogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState("all")

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatAction = (action: string) => {
    return action.replace(".", " › ").replace(/_/g, " ")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Audit Log</h1>
          <p className="text-muted-foreground">Track all platform activities and changes</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="room">Room Changes</SelectItem>
                <SelectItem value="booking">Bookings</SelectItem>
                <SelectItem value="hotel">Hotels</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="pricing">Pricing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead className="hidden md:table-cell">Details</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAuditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <Badge variant="secondary" className={`font-normal capitalize ${actionColors[log.action] || ""}`}>
                        {formatAction(log.action)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium truncate max-w-[150px]">{log.actor}</span>
                        <Badge variant="outline" className={`w-fit text-xs ${actorTypeColors[log.actorType] || ""}`}>
                          {log.actorType.replace("_", " ")}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{log.target}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-sm max-w-[250px] truncate">
                      {log.details}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {formatDate(log.timestamp)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {mockAuditLogs.length} of {mockAuditLogs.length} entries
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
