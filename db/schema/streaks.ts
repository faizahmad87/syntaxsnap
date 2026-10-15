import {
  check,
  date,
  integer,
  pgPolicy,
  pgTable,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { authenticatedRole } from "drizzle-orm/supabase"
import { authUsers } from "./auth"

export const streaks = pgTable(
  "streaks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    currentCount: integer("current_count").notNull().default(0),
    longestCount: integer("longest_count").notNull().default(0),
    lastActivityDate: date("last_activity_date"),
    freezesAvailable: integer("freezes_available").notNull().default(1),
    freezesUsedThisWeek: integer("freezes_used_this_week").notNull().default(0),
    weekStart: date("week_start"),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    check("chk_streaks_current_non_negative", sql`${t.currentCount} >= 0`),
    check("chk_streaks_longest_non_negative", sql`${t.longestCount} >= 0`),
    check("chk_streaks_freezes_non_negative", sql`${t.freezesAvailable} >= 0`),
    pgPolicy("streaks_owner", {
      for: "all",
      to: authenticatedRole,
      using: sql`auth.uid() = ${t.userId}`,
      withCheck: sql`auth.uid() = ${t.userId}`,
    }),
  ],
)

export type Streak = typeof streaks.$inferSelect
export type NewStreak = typeof streaks.$inferInsert
