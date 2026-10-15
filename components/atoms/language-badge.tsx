import { cn } from "@/lib/utils"
import type { Language } from "@/modules/quiz/types/question"

const LANGUAGE_CONFIG: Record<Language, { logo: string; label: string }> = {
  javascript: { logo: "/js_logo.png", label: "JavaScript" },
  python: { logo: "/python_logo.png", label: "Python" },
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo} alt={label} width={14} height={14} className="rounded-sm" />
      {label}
    </span>
  )
}
