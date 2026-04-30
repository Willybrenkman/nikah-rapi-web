-- ============================================================
-- NIKAH RAPI — PATCH SQL v2.1 (Activity Logs & Receipts)
-- Jalankan di Supabase SQL Editor
-- v2.1.1 — Fixed by Senior Audit, 1 Mei 2026
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

-- Index untuk query performa (filter by wedding + sort by time)
CREATE INDEX IF NOT EXISTS idx_activity_logs_wedding ON activity_logs(wedding_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at DESC);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- ⚠️ FIX: Intern hanya membuat SELECT policy, sehingga INSERT DITOLAK oleh RLS.
-- Harus menggunakan FOR ALL agar user bisa INSERT log dari frontend.
-- Drop policy lama jika ada (aman karena IF EXISTS)
DROP POLICY IF EXISTS "Users view own activity logs" ON activity_logs;

-- Buat policy yang benar: FOR ALL (SELECT + INSERT)
-- Tidak perlu UPDATE/DELETE untuk logs (immutable audit trail)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'activity_logs' AND policyname = 'Users manage own activity_logs'
  ) THEN
    CREATE POLICY "Users manage own activity_logs"
      ON activity_logs FOR ALL
      USING (wedding_id = get_wedding_id())
      WITH CHECK (wedding_id = get_wedding_id());
  END IF;
END $$;

-- ── 10. ADD receipt_url to budget_payments ────────────────────
ALTER TABLE budget_payments ADD COLUMN IF NOT EXISTS receipt_url TEXT;

-- ============================================================
-- PATCH v2.1.1 DONE! ✅
-- Changelog:
--   - Fixed RLS: SELECT-only → FOR ALL (agar INSERT log bisa jalan)
--   - Added indexes untuk performa query Activity Logs
--   - Added receipt_url column ke budget_payments
-- ============================================================
