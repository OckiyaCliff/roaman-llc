import type React from "react"
import { PublicHeader } from "@/components/public/header"
import { PublicFooter } from "@/components/public/footer"
import { BottomNav } from "@/components/public/bottom-nav"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <PublicFooter />
      <BottomNav />
    </div>
  )
}
