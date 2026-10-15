import {
  check,
  index,
  integer,
  pgPolicy,
  pgTable,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { authenticatedRole } from "drizzle-orm/supabase"
import { authUsers } from "./auth"
import { dailySessions } from "./daily-sessions"
import { tokenReasonEnum } from "./enums"

export const tokenLedger = pgTable(
  "token_ledger",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    amount: integer("amount").notNull(),
    reason: tokenReasonEnum("reason").notNull(),
    sessionId: uuid("session_id").references(() => dailySessions.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    check("chk_token_ledger_nonzero", sql`${t.amount} <> 0`),
    index("idx_token_ledger_user_created").on(t.userId, t.createdAt),
    // Owner can read their own ledger; no user INSERT (server-side only)
    pgPolicy("token_ledger_owner_select", {
      for: "select",
      to: authenticatedRole,
      using: sql`auth.uid() = ${t.userId}`,
    }),
  ],
)

export type TokenLedgerEntry = typeof tokenLedger.$inferSelect
export type NewTokenLedgerEntry = typeof tokenLedger.$inferInsert
