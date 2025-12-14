import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Clock, Moon, Calendar } from "lucide-react"

export default async function PricingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/hotel/login")
  }

  const { data: staffRecord } = await supabase
    .from("hotel_staff")
    .select("hotel_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single()

  if (!staffRecord) {
    redirect("/hotel/dashboard")
  }

  const { data: pricingRules } = await supabase
    .from("pricing_rules")
    .select("*, room_types(name)")
    .eq("hotel_id", staffRecord.hotel_id)
    .order("rule_type")
    .order("priority", { ascending: false })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getRuleIcon = (type: string) => {
    switch (type) {
      case "hourly":
        return Clock
      case "nightly":
        return Moon
      default:
        return Calendar
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pricing Rules</h1>
          <p className="text-muted-foreground">Configure your room pricing</p>
        </div>
        <Button asChild>
          <Link href="/hotel/pricing/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Rule
          </Link>
        </Button>
      </div>

      {pricingRules && pricingRules.length > 0 ? (
        <div className="space-y-4">
          {pricingRules.map((rule) => {
            const RuleIcon = getRuleIcon(rule.rule_type)
            return (
              <Card key={rule.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                      <RuleIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{rule.name}</p>
                        <Badge variant={rule.is_active ? "default" : "secondary"}>
                          {rule.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {(rule.room_types as any)?.name || "All room types"} · {rule.rule_type}
                        {rule.min_hours && rule.max_hours && ` · ${rule.min_hours}-${rule.max_hours} hours`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xl font-bold">{formatPrice(rule.price)}</p>
                      <p className="text-xs text-muted-foreground">
                        per {rule.rule_type === "hourly" ? "hour" : rule.rule_type === "nightly" ? "night" : "period"}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild className="bg-transparent">
                      <Link href={`/hotel/pricing/${rule.id}`}>Edit</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No pricing rules configured</p>
            <Button asChild>
              <Link href="/hotel/pricing/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Pricing Rule
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
