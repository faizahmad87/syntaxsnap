import { cn } from "@/lib/utils"
import type { Language } from "@/modules/quiz/types/question"

const LANGUAGE_CONFIG: Record<Language, { icon: string; label: string }> = {
  javascript: { icon: "🟨", label: "JavaScript" },
  python: { icon: "🐍", label: "Python" },
}

interface LanguageBadgeProps {
  language: Language
  className?: string
}

export function LanguageBadge({ language, className }: LanguageBadgeProps) {
  const { icon, label } = LANGUAGE_CONFIG[language]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground",
        className,
      )}
    >
      <span className="text-sm leading-none">{icon}</span>
      {label}
    </span>
  )
}
