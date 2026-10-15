"use client"

import Link from "next/link"
import { ArrowLeft, Flame } from "lucide-react"
import { TokenCounter } from "@/components/molecules/token-counter"

interface SessionHeaderProps {
  backHref: string
  streakCount: number
  tokenBalance: number
}

export function SessionHeader({ backHref, streakCount, tokenBalance }: SessionHeaderProps) {
  return (
    <header className="flex items-center justify-between py-4 px-4">
      <Link
        href={backHref}
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-border bg-secondary text-muted-foreground transition-colors"
        aria-label="Back"
      >
        <ArrowLeft className="w-4 h-4" />
      </Link>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-sm font-semibold">
          <Flame
            className="w-4 h-4 text-warning"
            fill={streakCount > 0 ? "currentColor" : "none"}
          />
          <span className={streakCount > 0 ? "text-warning" : "text-muted-foreground"}>
            {streakCount}
          </span>
        </div>

        <TokenCounter amount={tokenBalance} size="sm" />
      </div>
    </header>
  )
}
