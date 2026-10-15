CREATE TYPE "public"."badge_type" AS ENUM('first_perfect_day', 'week_warrior', 'iron_dev', 'language_master');--> statement-breakpoint
CREATE TYPE "public"."difficulty_type" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TYPE "public"."language_type" AS ENUM('javascript', 'python');--> statement-breakpoint
CREATE TYPE "public"."token_reason" AS ENUM('correct_answer', 'daily_completion_bonus', 'streak_bonus', 'freeze_purchase');--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"display_name" text NOT NULL,
	"avatar_url" text,
	"preferred_language" "language_type" DEFAULT 'javascript' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "questions" (
	"id" text PRIMARY KEY NOT NULL,
	"language" "language_type" NOT NULL,
	"difficulty" "difficulty_type" NOT NULL,
	"prompt" text NOT NULL,
	"options" jsonb NOT NULL,
	"correct_option_id" text NOT NULL,
	"explanation" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "questions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "daily_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"date" date NOT NULL,
	"language" "language_type" NOT NULL,
	"question_ids" text[] NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	CONSTRAINT "uq_daily_sessions_user_date_lang" UNIQUE("user_id","date","language")
);
--> statement-breakpoint
ALTER TABLE "daily_sessions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"session_id" uuid NOT NULL,
	"question_id" text NOT NULL,
	"selected_option_id" text NOT NULL,
	"is_correct" boolean NOT NULL,
	"answered_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "answers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "streaks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"current_count" integer DEFAULT 0 NOT NULL,
	"longest_count" integer DEFAULT 0 NOT NULL,
	"last_activity_date" date,
	"freezes_available" integer DEFAULT 1 NOT NULL,
	"freezes_used_this_week" integer DEFAULT 0 NOT NULL,
	"week_start" date,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "streaks_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "chk_streaks_current_non_negative" CHECK ("streaks"."current_count" >= 0),
	CONSTRAINT "chk_streaks_longest_non_negative" CHECK ("streaks"."longest_count" >= 0),
	CONSTRAINT "chk_streaks_freezes_non_negative" CHECK ("streaks"."freezes_available" >= 0)
);
--> statement-breakpoint
ALTER TABLE "streaks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "token_ledger" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"reason" "token_reason" NOT NULL,
	"session_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chk_token_ledger_nonzero" CHECK ("token_ledger"."amount" <> 0)
);
--> statement-breakpoint
ALTER TABLE "token_ledger" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "badges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "badge_type" NOT NULL,
	"earned_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_badges_user_type" UNIQUE("user_id","type")
);
--> statement-breakpoint
ALTER TABLE "badges" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_sessions" ADD CONSTRAINT "daily_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_session_id_daily_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."daily_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "streaks" ADD CONSTRAINT "streaks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "token_ledger" ADD CONSTRAINT "token_ledger_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "token_ledger" ADD CONSTRAINT "token_ledger_session_id_daily_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."daily_sessions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "badges" ADD CONSTRAINT "badges_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_questions_language_active" ON "questions" USING btree ("language","is_active");--> statement-breakpoint
CREATE INDEX "idx_daily_sessions_user_date" ON "daily_sessions" USING btree ("user_id","date");--> statement-breakpoint
CREATE INDEX "idx_answers_user_session" ON "answers" USING btree ("user_id","session_id");--> statement-breakpoint
CREATE INDEX "idx_answers_user_question" ON "answers" USING btree ("user_id","question_id");--> statement-breakpoint
CREATE INDEX "idx_token_ledger_user_created" ON "token_ledger" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_badges_user" ON "badges" USING btree ("user_id");--> statement-breakpoint
CREATE POLICY "profiles_select_all" ON "profiles" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "profiles_update_owner" ON "profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (auth.uid() = id) WITH CHECK (auth.uid() = id);--> statement-breakpoint
CREATE POLICY "questions_select_all" ON "questions" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "daily_sessions_owner" ON "daily_sessions" AS PERMISSIVE FOR ALL TO "authenticated" USING (auth.uid() = "daily_sessions"."user_id") WITH CHECK (auth.uid() = "daily_sessions"."user_id");--> statement-breakpoint
CREATE POLICY "answers_owner" ON "answers" AS PERMISSIVE FOR ALL TO "authenticated" USING (auth.uid() = "answers"."user_id") WITH CHECK (auth.uid() = "answers"."user_id");--> statement-breakpoint
CREATE POLICY "streaks_owner" ON "streaks" AS PERMISSIVE FOR ALL TO "authenticated" USING (auth.uid() = "streaks"."user_id") WITH CHECK (auth.uid() = "streaks"."user_id");--> statement-breakpoint
CREATE POLICY "token_ledger_owner_select" ON "token_ledger" AS PERMISSIVE FOR SELECT TO "authenticated" USING (auth.uid() = "token_ledger"."user_id");--> statement-breakpoint
CREATE POLICY "badges_owner" ON "badges" AS PERMISSIVE FOR ALL TO "authenticated" USING (auth.uid() = "badges"."user_id") WITH CHECK (auth.uid() = "badges"."user_id");