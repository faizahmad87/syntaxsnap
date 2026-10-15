import { cn } from "@/lib/utils"
import type { Language } from "@/modules/quiz/types/question"

const LANGUAGE_CONFIG: Record<Language, { logo: string; label: string }> = {
  javascript: { logo: "/languages/javascript.png", label: "JavaScript" },
  python: { logo: "/languages/python.png", label: "Python" },
}

interface LanguageBadgeProps {
  language: Language
  className?: string
}

export function LanguageBadge({ language, className }: LanguageBadgeProps) {
  const { logo, label } = LANGUAGE_CONFIG[language]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground",
        className,
      )}
    >
      <img src={logo} alt={label} width={14} height={14} className="object-contain" />
      {label}
    </span>
  )
}
