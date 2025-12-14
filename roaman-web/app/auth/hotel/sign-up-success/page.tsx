import Link from "next/link"
import { CheckCircle, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/ui/logo"

export default function HotelSignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-secondary/30">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" />
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </div>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>We have sent you a confirmation link</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Mail className="h-5 w-5" />
              <span>Verification email sent</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Click the link in your email to verify your account and complete the hotel registration process.
            </p>
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link href="/auth/hotel/login">Back to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
