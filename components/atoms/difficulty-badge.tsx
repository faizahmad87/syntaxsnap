import { cn } from "@/lib/utils"
import type { DifficultyLevel } from "@/modules/quiz/types/question"

const DIFFICULTY_CONFIG: Record<DifficultyLevel, { label: string; className: string }> = {
  easy: {
    label: "Easy",
    className: "text-success border-success/40 bg-success/5",
  },
  medium: {
    label: "Medium",
    className: "text-warning border-warning/40 bg-warning/5",
  },
  hard: {
    label: "Hard",
    className: "text-destructive border-destructive/40 bg-destructive/5",
  },
}

interface DifficultyBadgeProps {
  difficulty: DifficultyLevel
  className?: string
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const { label, className: variantClass } = DIFFICULTY_CONFIG[difficulty]
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium capitalize",
        variantClass,
        className,
      )}
    >
      {label}
    </span>
  )
}
