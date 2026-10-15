import type { Language } from "@/modules/quiz/types/question"

export type SessionProgress = {
  answered: number
  total: number
}

export type HomeData = {
  currentStreak: number
  longestStreak: number
  isActiveToday: boolean
  completedLanguages: Language[]
  sessionProgress: Partial<Record<Language, SessionProgress>>
}
