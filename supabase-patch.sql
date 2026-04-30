-- ============================================================
-- NIKAH RAPI — PATCH SQL (untuk DB yang sudah ada datanya)
-- Jalankan di Supabase SQL Editor
-- AMAN: Semua perintah pakai IF NOT EXISTS / IF EXISTS
-- ============================================================

-- ── 1. CREATE budget_payments ────────────────────────────────
CREATE TABLE IF NOT EXISTS budget_payments (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    budget_item_id  UUID REFERENCES budget_items(id) ON DELETE CASCADE NOT NULL,
    wedding_id      UUID REFERENCES wedding_profiles(id) ON DELETE CASCADE NOT NULL,
    description     TEXT NOT NULL DEFAULT 'Pembayaran',
    amount          BIGINT DEFAULT 0,
    payment_date    DATE DEFAULT CURRENT_DATE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_budget_payments_item ON budget_payments(budget_item_id);
CREATE INDEX IF NOT EXISTS idx_budget_payments_wedding ON budget_payments(wedding_id);

ALTER TABLE budget_payments ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'budget_payments' AND policyname = 'Users manage own budget_payments'
  ) THEN
    CREATE POLICY "Users manage own budget_payments"
      ON budget_payments FOR ALL
      USING (wedding_id = get_wedding_id())
      WITH CHECK (wedding_id = get_wedding_id());
  END IF;
END $$;


-- ── 2. CREATE honeymoon_info ─────────────────────────────────
CREATE TABLE IF NOT EXISTS honeymoon_info (
    id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wedding_id   UUID REFERENCES wedding_profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
    destinasi    TEXT,
    durasi       TEXT,
    total_budget BIGINT DEFAULT 0,
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE honeymoon_info ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'honeymoon_info' AND policyname = 'Users manage own honeymoon_info'
  ) THEN
    CREATE POLICY "Users manage own honeymoon_info"
      ON honeymoon_info FOR ALL
      USING (wedding_id = get_wedding_id())
      WITH CHECK (wedding_id = get_wedding_id());
  END IF;
END $$;

-- Trigger updated_at
DROP TRIGGER IF EXISTS trg_updated_at ON honeymoon_info;
CREATE TRIGGER trg_updated_at
    BEFORE UPDATE ON honeymoon_info
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ── 3. ADD missing columns to budget_items ───────────────────
ALTER TABLE budget_items ADD COLUMN IF NOT EXISTS tipe TEXT;
ALTER TABLE budget_items ADD COLUMN IF NOT EXISTS file_url TEXT;

CREATE INDEX IF NOT EXISTS idx_budget_items_tipe ON budget_items(tipe);


-- ── 4. ADD kontrak_url to vendors ────────────────────────────
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS kontrak_url TEXT;


-- ── 5. ADD checklist_items to souvenir_vendor ────────────────
ALTER TABLE souvenir_vendor ADD COLUMN IF NOT EXISTS checklist_items JSONB DEFAULT '{}';


-- ── 6. DROP UNIQUE constraint on souvenir_vendor.wedding_id ──
-- (Cek nama constraint dulu jika beda)
ALTER TABLE souvenir_vendor DROP CONSTRAINT IF EXISTS souvenir_vendor_wedding_id_key;


-- ── 7. MIGRASI data honeymoon dari wedding_profiles ke honeymoon_info ──
-- SKIP: Kolom hm_* mungkin belum ada di wedding_profiles lama.
-- Jika kolom hm_destinasi/hm_durasi/hm_budget ADA di wedding_profiles,
-- jalankan query ini TERPISAH setelah patch:
--
-- INSERT INTO honeymoon_info (wedding_id, destinasi, durasi, total_budget)
-- SELECT id, hm_destinasi, hm_durasi, COALESCE(hm_budget, 0)
-- FROM wedding_profiles
-- WHERE hm_destinasi IS NOT NULL OR hm_durasi IS NOT NULL OR hm_budget IS NOT NULL
-- ON CONFLICT (wedding_id) DO NOTHING;


-- ── 8. OPTIONAL: Hapus kolom duplikat dari wedding_profiles ──
-- Uncomment baris berikut setelah pastikan data sudah termigrasi
-- ALTER TABLE wedding_profiles DROP COLUMN IF EXISTS hm_destinasi;
-- ALTER TABLE wedding_profiles DROP COLUMN IF EXISTS hm_durasi;
-- ALTER TABLE wedding_profiles DROP COLUMN IF EXISTS hm_budget;


-- ============================================================
-- PATCH SELESAI! ✅
-- Cek hasil di Supabase Table Editor
-- ============================================================
