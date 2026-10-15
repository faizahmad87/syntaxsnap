import { pgEnum } from "drizzle-orm/pg-core"

export const languageTypeEnum = pgEnum("language_type", [
  "javascript",
  "python",
])

export const difficultyTypeEnum = pgEnum("difficulty_type", [
  "easy",
  "medium",
  "hard",
])

export const tokenReasonEnum = pgEnum("token_reason", [
  "correct_answer",
  "daily_completion_bonus",
  "streak_bonus",
  "freeze_purchase",
])

export const badgeTypeEnum = pgEnum("badge_type", [
  "first_perfect_day",
  "week_warrior",
  "iron_dev",
  "language_master",
])
