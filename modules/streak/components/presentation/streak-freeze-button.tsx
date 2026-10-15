"use client"

import { Snowflake, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useStreak } from "../../hooks/use-streak"

export function StreakFreezeButton() {
  const { streak, isUsingFreeze, useFreeze } = useStreak()

  const handleUseFreeze = async () => {
    if (!streak || streak.freezesAvailable < 1) {
      toast.error("No freeze available this week.")
      return
    }
    await useFreeze()
    toast.success("Streak freeze used — your streak is safe today.")
  }

  if (!streak) return null

  const canUseFreeze =
    streak.freezesAvailable > 0 && streak.currentCount > 0 && !isUsingFreeze

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              streak.freezesAvailable > 0 ? "bg-sky-500/15" : "bg-muted",
            )}
          >
            <Snowflake
              className={cn(
                "w-5 h-5",
                streak.freezesAvailable > 0 ? "text-sky-400" : "text-muted-foreground",
              )}
            />
          </div>
          <div>
            <p className="text-sm font-medium">
              {streak.freezesAvailable > 0
                ? `${streak.freezesAvailable} freeze available`
                : "No freeze available"}
            </p>
            <p className="text-xs text-muted-foreground">Resets every Monday</p>
          </div>
        </div>

        <Button
          size="sm"
          variant="secondary"
          onClick={handleUseFreeze}
          disabled={!canUseFreeze}
          className="h-9 text-xs shrink-0"
        >
          {isUsingFreeze ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            "Use freeze"
          )}
        </Button>
      </div>
    </div>
  )
}
