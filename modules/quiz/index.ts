export { quizService } from "./services/quiz-service"
export { useDailyQuestions } from "./hooks/use-daily-questions"
export { useSubmitAnswer } from "./hooks/use-submit-answer"
export type {
  QuizQuestion,
  AnswerOption,
  AnswerResult,
  QuizSession,
  Language,
  DifficultyLevel,
} from "./types/question"
export type { SubmitAnswerInput, LanguageInput } from "./types/schemas"
export type { QuestionsResponse, AnswerResponse } from "./types/responses"
