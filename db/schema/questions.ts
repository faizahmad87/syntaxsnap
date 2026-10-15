import {
  boolean,
  index,
  jsonb,
  pgPolicy,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { difficultyTypeEnum, languageTypeEnum } from "./enums"

type AnswerOptionRecord = {
  id: string
  text: string
}

export const questions = pgTable(
  "questions",
  {
    id: text("id").primaryKey(),
    language: languageTypeEnum("language").notNull(),
    difficulty: difficultyTypeEnum("difficulty").notNull(),
    prompt: text("prompt").notNull(),
    options: jsonb("options").notNull().$type<AnswerOptionRecord[]>(),
    correctOptionId: text("correct_option_id").notNull(),
    explanation: text("explanation").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("idx_questions_language_active").on(t.language, t.isActive),
    // Public read — questions are not sensitive
    // Writes are seeded via service role only, no user write policy needed
    pgPolicy("questions_select_all", {
      for: "select",
      to: "public",
      using: sql`true`,
    }),
  ],
)

export type Question = typeof questions.$inferSelect
export type NewQuestion = typeof questions.$inferInsert
