export type Language = "javascript" | "python"

export type DifficultyLevel = "easy" | "medium" | "hard"

export type AnswerOption = {
  id: string
  text: string
}

// Client-safe question — correctOptionId intentionally excluded
export type QuizQuestion = {
  id: string
  language: Language
  difficulty: DifficultyLevel
  prompt: string
  options: AnswerOption[]
}

// Returned after submitting an answer — reveals correctOptionId and explanation
export type AnswerResult = {
  questionId: string
  selectedOptionId: string
  isCorrect: boolean
  correctOptionId: string
  explanation: string
  tokensEarned: number
}

export type QuizSession = {
  questions: QuizQuestion[]
  currentIndex: number
  answers: AnswerResult[]
  isComplete: boolean
  totalTokensEarned: number
}
