import {
  boolean,
  index,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { authenticatedRole } from "drizzle-orm/supabase"
import { authUsers } from "./auth"
import { dailySessions } from "./daily-sessions"
import { questions } from "./questions"

export const answers = pgTable(
  "answers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => dailySessions.id, { onDelete: "cascade" }),
    questionId: text("question_id")
      .notNull()
      .references(() => questions.id),
    selectedOptionId: text("selected_option_id").notNull(),
    isCorrect: boolean("is_correct").notNull(),
    answeredAt: timestamp("answered_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("idx_answers_user_session").on(t.userId, t.sessionId),
    index("idx_answers_user_question").on(t.userId, t.questionId),
    pgPolicy("answers_owner", {
      for: "all",
      to: authenticatedRole,
      using: sql`auth.uid() = ${t.userId}`,
      withCheck: sql`auth.uid() = ${t.userId}`,
    }),
  ],
)

export type Answer = typeof answers.$inferSelect
export type NewAnswer = typeof answers.$inferInsert
