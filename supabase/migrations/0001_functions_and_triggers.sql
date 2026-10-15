-- =============================================================================
-- Custom migration: 0001_functions_and_triggers
-- Runs after 0000 (schema + RLS). Adds the sign-up trigger and the
-- pick_daily_questions helper function.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- TRIGGER — auto-create profile + streak row on new sign-up
-- SECURITY DEFINER so it runs as the function owner (postgres), bypassing RLS
-- on the inserts into profiles and streaks.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );

  INSERT INTO streaks (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ---------------------------------------------------------------------------
-- FUNCTION — pick N questions for a user's daily session
-- Prefers questions not answered in the last 14 days.
-- Falls back to the full active pool if fewer than p_count unseen remain.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION pick_daily_questions(
  p_user_id UUID,
  p_language language_type,
  p_count   INTEGER DEFAULT 5
)
RETURNS TABLE (question_id TEXT)
LANGUAGE sql
STABLE
AS $$
  WITH recently_seen AS (
    SELECT DISTINCT a.question_id
    FROM answers a
    JOIN daily_sessions ds ON a.session_id = ds.id
    WHERE a.user_id = p_user_id
      AND ds.date > CURRENT_DATE - INTERVAL '14 days'
  ),
  unseen AS (
    SELECT q.id
    FROM questions q
    WHERE q.language  = p_language
      AND q.is_active = TRUE
      AND q.id NOT IN (SELECT question_id FROM recently_seen)
    ORDER BY RANDOM()
    LIMIT p_count
  ),
  fallback AS (
    SELECT q.id
    FROM questions q
    WHERE q.language  = p_language
      AND q.is_active = TRUE
    ORDER BY RANDOM()
    LIMIT p_count
  )
  SELECT id FROM unseen
  UNION ALL
  SELECT id FROM fallback
  LIMIT p_count;
$$;