import {
  boolean,
  date,
  index,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { authenticatedRole } from "drizzle-orm/supabase"
import { authUsers } from "./auth"
import { languageTypeEnum } from "./enums"

export const dailySessions = pgTable(
  "daily_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    language: languageTypeEnum("language").notNull(),
    questionIds: text("question_ids").array().notNull(),
    completed: boolean("completed").notNull().default(false),
    startedAt: timestamp("started_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (t) => [
    unique("uq_daily_sessions_user_date_lang").on(
      t.userId,
      t.date,
      t.language,
    ),
    index("idx_daily_sessions_user_date").on(t.userId, t.date),
    pgPolicy("daily_sessions_owner", {
      for: "all",
      to: authenticatedRole,
      using: sql`auth.uid() = ${t.userId}`,
      withCheck: sql`auth.uid() = ${t.userId}`,
    }),
  ],
)

export type DailySession = typeof dailySessions.$inferSelect
export type NewDailySession = typeof dailySessions.$inferInsert
