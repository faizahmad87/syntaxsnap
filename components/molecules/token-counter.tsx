import { cn } from "@/lib/utils"

interface TokenCounterProps {
  amount: number
  className?: string
  size?: "sm" | "md"
}

export function TokenCounter({ amount, className, size = "md" }: TokenCounterProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 font-semibold tabular-nums",
        size === "sm" ? "text-xs" : "text-sm",
        className,
      )}
    >
      <span className={size === "sm" ? "text-sm" : "text-base"}>🪙</span>
      <span className="text-tokens">{amount.toLocaleString()}</span>
    </div>
  )
}
