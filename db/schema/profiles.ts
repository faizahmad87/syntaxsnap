import { pgPolicy, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { authenticatedRole } from "drizzle-orm/supabase"
import { authUsers } from "./auth"
import { languageTypeEnum } from "./enums"

export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id")
      .primaryKey()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    displayName: text("display_name").notNull(),
    avatarUrl: text("avatar_url"),
    preferredLanguage: languageTypeEnum("preferred_language")
      .notNull()
      .default("javascript"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  () => [
    // Public read — leaderboard needs display names from all users
    pgPolicy("profiles_select_all", {
      for: "select",
      to: "public",
      using: sql`true`,
    }),
    // Only the owner can update their own profile
    pgPolicy("profiles_update_owner", {
      for: "update",
      to: authenticatedRole,
      using: sql`auth.uid() = id`,
      withCheck: sql`auth.uid() = id`,
    }),
  ],
)

export type Profile = typeof profiles.$inferSelect
export type NewProfile = typeof profiles.$inferInsert
