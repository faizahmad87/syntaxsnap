"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Zap, Trophy, User } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/", label: "Practice", icon: Zap },
  { href: "/leaderboard", label: "Rankings", icon: Trophy },
  { href: "/profile", label: "Profile", icon: User },
] as const

export function BottomNav() {
  const pathname = usePathname()

  if (pathname.startsWith("/quiz") || pathname.startsWith("/results")) return null

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-card/95 backdrop-blur-md safe-bottom">
      <div className="mx-auto max-w-md flex">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/"
              ? pathname === "/" ||
                pathname.startsWith("/quiz") ||
                pathname.startsWith("/results")
              : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-3 min-h-[48px] text-xs font-medium transition-colors cursor-pointer",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon
                className={cn("w-5 h-5 transition-transform", isActive && "scale-110")}
                strokeWidth={isActive ? 2.5 : 1.75}
              />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
