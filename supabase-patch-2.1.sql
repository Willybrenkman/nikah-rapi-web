-- ============================================================
-- NIKAH RAPI — PATCH SQL v2.1 (Activity Logs & Receipts)
-- Jalankan di Supabase SQL Editor
-- ============================================================

-- ── 9. CREATE activity_logs ──────────────────────────────────
CREATE TABLE IF NOT EXISTS activity_logs (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wedding_id  UUID REFERENCES wedding_profiles(id) ON DELETE CASCADE NOT NULL,
    user_email  TEXT,
    action      TEXT NOT NULL,
    details     TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'activity_logs' AND policyname = 'Users view own activity logs'
  ) THEN
    CREATE POLICY "Users view own activity logs"
      ON activity_logs FOR SELECT
      USING (wedding_id = get_wedding_id());
  END IF;
END $$;

-- ── 10. ADD receipt_url to budget_payments ────────────────────
ALTER TABLE budget_payments ADD COLUMN IF NOT EXISTS receipt_url TEXT;

-- DONE! ✅
