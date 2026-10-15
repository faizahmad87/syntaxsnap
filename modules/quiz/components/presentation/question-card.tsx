import { LanguageBadge } from "@/components/atoms/language-badge"
import { DifficultyBadge } from "@/components/atoms/difficulty-badge"
import type { DifficultyLevel, Language } from "../../types/question"

interface QuestionCardProps {
  prompt: string
  language: Language
  difficulty: DifficultyLevel
}

function renderPrompt(prompt: string) {
  const parts = prompt.split(/(`[^`]+`)/)
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded-md text-[0.9em]"
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    return <span key={i}>{part}</span>
  })
}

export function QuestionCard({ prompt, language, difficulty }: QuestionCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <LanguageBadge language={language} />
        <span className="text-muted-foreground/30">·</span>
        <DifficultyBadge difficulty={difficulty} />
      </div>

      <p className="text-base leading-relaxed font-medium">
        {renderPrompt(prompt)}
      </p>
    </div>
  )
}
