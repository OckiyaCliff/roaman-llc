import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Roaman - Find Stays Near You",
    template: "%s | Roaman",
  },
  description:
    "Discover and book available hotels, lodges, and serviced apartments near you in seconds. No account needed.",
  keywords: ["hotel booking", "last minute stays", "nearby hotels", "Lagos hotels", "hourly booking", "short stay"],
  authors: [{ name: "Roaman" }],
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "Roaman",
    title: "Roaman - Find Stays Near You",
    description: "Discover and book available hotels, lodges, and serviced apartments near you in seconds.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roaman - Find Stays Near You",
    description: "Discover and book available hotels, lodges, and serviced apartments near you in seconds.",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#171717" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
