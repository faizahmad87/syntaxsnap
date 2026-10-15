import {
  index,
  pgPolicy,
  pgTable,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { authenticatedRole } from "drizzle-orm/supabase"
import { authUsers } from "./auth"
import { badgeTypeEnum } from "./enums"

export const badges = pgTable(
  "badges",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    type: badgeTypeEnum("type").notNull(),
    earnedAt: timestamp("earned_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    unique("uq_badges_user_type").on(t.userId, t.type),
    index("idx_badges_user").on(t.userId),
    pgPolicy("badges_owner", {
      for: "all",
      to: authenticatedRole,
      using: sql`auth.uid() = ${t.userId}`,
      withCheck: sql`auth.uid() = ${t.userId}`,
    }),
  ],
)

export type Badge = typeof badges.$inferSelect
export type NewBadge = typeof badges.$inferInsert
