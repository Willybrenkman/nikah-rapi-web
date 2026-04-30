-- ============================================================
-- NIKAH RAPI — Complete Supabase SQL Schema (FIXED)
-- Jalankan di Supabase SQL Editor
-- Versi: 2.0 — 30 April 2026
-- ============================================================

-- ── 1. WEDDING PROFILES ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS wedding_profiles (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id             UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  nama_pengantin_1    TEXT,
  nama_pengantin_2    TEXT,
  tanggal_pernikahan  DATE,
  lokasi_akad         TEXT,
  lokasi_resepsi      TEXT,
  total_budget        BIGINT DEFAULT 0,

  -- Undangan summary counters
  undangan_cetak      INT DEFAULT 0,
  undangan_digital    INT DEFAULT 0,
  undangan_terkirim   INT DEFAULT 0,

  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. BUDGET ITEMS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS budget_items (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id        UUID REFERENCES wedding_profiles(id) ON DELETE CASCADE NOT NULL,
  kategori          TEXT NOT NULL,
  tipe              TEXT,
  jumlah_estimasi   BIGINT DEFAULT 0,
  jumlah_aktual     BIGINT DEFAULT 0,
  catatan           TEXT,
  file_url          TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2B. BUDGET PAYMENTS (BARU) ───────────────────────────────
CREATE TABLE IF NOT EXISTS budget_payments (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  budget_item_id  UUID REFERENCES budget_items(id) ON DELETE CASCADE NOT NULL,
  wedding_id      UUID REFERENCES wedding_profiles(id) ON DELETE CASCADE NOT NULL,
  description     TEXT NOT NULL DEFAULT 'Pembayaran',
  amount          BIGINT DEFAULT 0,
  payment_date    DATE DEFAULT CURRENT_DATE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── 3. SESERAHAN ITEMS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS seserahan_items (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id    UUID REFERENCES wedding_profiles(id) ON DELETE CASCADE NOT NULL,
  nama          TEXT NOT NULL,
  kategori      TEXT DEFAULT 'Lainnya',
  estimasi      BIGINT DEFAULT 0,
  aktual        BIGINT DEFAULT 0,
  tempat_beli   TEXT,
  status        TEXT DEFAULT 'Belum Beli',
  catatan       TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── 4. KADO & ANGPAO ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS kado_angpao (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id      UUID REFERENCES wedding_profiles(id) ON DELETE CASCADE NOT NULL,
  nama            TEXT NOT NULL,
  hubungan        TEXT DEFAULT 'Keluarga',
  jenis           TEXT DEFAULT 'Angpao',
  nominal         BIGINT DEFAULT 0,
  deskripsi_kado  TEXT,
  sesi            TEXT DEFAULT 'Resepsi',
  sudah_ucapkan   BOOLEAN DEFAULT FALSE,
  catatan         TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── 5. TAMU UNDANGAN ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tamu_undangan (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id    UUID REFERENCES wedding_profiles(id) ON DELETE CASCADE NOT NULL,
  nama          TEXT NOT NULL,
  hubungan      TEXT DEFAULT 'Teman',
  no_hp         TEXT,
  asal_kota     TEXT,
  jumlah_orang  INT DEFAULT 1,
  no_meja       TEXT,
  status_rsvp   TEXT DEFAULT 'belum',
  kupon_makan   BOOLEAN DEFAULT FALSE,
  catatan       TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── 6. VENDORS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vendors (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id        UUID REFERENCES wedding_profiles(id) ON DELETE CASCADE NOT NULL,
  nama              TEXT NOT NULL,
  kategori          TEXT DEFAULT 'Lainnya',
  pic_nama          TEXT,
  pic_hp            TEXT,
  total             BIGINT DEFAULT 0,
  dp                BIGINT DEFAULT 0,
  deadline_pelunasan DATE,
  status_kontrak    TEXT DEFAULT 'Belum TTD',
  kontrak_url       TEXT,
  catatan           TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── 7. CHECKLIST ITEMS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS checklist_items (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id  UUID REFERENCES wedding_profiles(id) ON DELETE CASCADE NOT NULL,
  task        TEXT NOT NULL,
  kategori    TEXT DEFAULT 'Umum',
  deadline    TEXT,
  pic         TEXT,
  priority    TEXT DEFAULT 'Medium',
  status      TEXT DEFAULT 'Belum',
  is_done     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 8. TIMELINE EVENTS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS timeline_events (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id    UUID REFERENCES wedding_profiles(id) ON DELETE CASCADE NOT NULL,
  sesi          TEXT DEFAULT 'Hari-H Akad',
  waktu         TEXT,
  durasi_menit  INT DEFAULT 0,
  event         TEXT NOT NULL,
  lokasi        TEXT,
  status        TEXT DEFAULT 'Belum',
  catatan       TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── 9. CATATAN ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS catatan (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id  UUID REFERENCES wedding_profiles(id) ON DELETE CASCADE NOT NULL,
  judul       TEXT NOT NULL,
  kategori    TEXT DEFAULT 'Lainnya',
  priority    TEXT DEFAULT 'Medium',
  isi         TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 10. KATERING VENDOR ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS katering_vendor (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id          UUID REFERENCES wedding_profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  nama_vendor         TEXT,
  pic_nama            TEXT,
  pic_hp              TEXT,
  total_kontrak       BIGINT DEFAULT 0,
  dp_dibayar          BIGINT DEFAULT 0,
  deadline_pelunasan  DATE,
  estimasi_porsi      INT DEFAULT 0,
  harga_per_pax       BIGINT DEFAULT 0,
  catatan_khusus      TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ── 11. KATERING MENU ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS katering_menu (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id  UUID REFERENCES wedding_profiles(id) ON DELETE CASCADE NOT NULL,
  nama_menu   TEXT NOT NULL,
  jenis       TEXT DEFAULT 'Makanan',
  sistem      TEXT DEFAULT 'Prasmanan',
  ada         BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 12. MUA DETAIL ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mua_detail (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id  UUID REFERENCES wedding_profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  nama_mua    TEXT,
  no_hp       TEXT,
  paket       TEXT,
  total       BIGINT DEFAULT 0,
  dp          BIGINT DEFAULT 0,
  catatan     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 13. MUA JADWAL ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mua_jadwal (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id  UUID REFERENCES wedding_profiles(id) ON DELETE CASCADE NOT NULL,
  tanggal     DATE,
  waktu       TEXT,
  agenda      TEXT NOT NULL,
  status      TEXT DEFAULT 'Belum',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 14. AKSESORI BUSANA ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS aksesori_busana (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id  UUID REFERENCES wedding_profiles(id) ON DELETE CASCADE NOT NULL,
  nama        TEXT NOT NULL,
  selesai     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 15. DOKUMENTASI VENDOR (Foto & Video) ────────────────────
CREATE TABLE IF NOT EXISTS dokumentasi_vendor (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id  UUID REFERENCES wedding_profiles(id) ON DELETE CASCADE NOT NULL,
  tipe        TEXT NOT NULL, -- 'foto' atau 'video'
  nama        TEXT,
  no_hp       TEXT,
  paket       TEXT,
  total       BIGINT DEFAULT 0,
  dp          BIGINT DEFAULT 0,
  catatan     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(wedding_id, tipe)
);

-- ── 16. SHOT LIST ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS shot_list (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id  UUID REFERENCES wedding_profiles(id) ON DELETE CASCADE NOT NULL,
  sesi        TEXT DEFAULT 'Akad',
  deskripsi   TEXT NOT NULL,
  priority    TEXT DEFAULT 'High',
  status      TEXT DEFAULT 'Belum',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 17. DEKORASI ITEMS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS dekorasi_items (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id  UUID REFERENCES wedding_profiles(id) ON DELETE CASCADE NOT NULL,
  nama        TEXT NOT NULL,
  area        TEXT DEFAULT 'Lainnya',
  estimasi    BIGINT DEFAULT 0,
  status      TEXT DEFAULT 'Belum',
  catatan     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 18. UNDANGAN VENDOR ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS undangan_vendor (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id    UUID REFERENCES wedding_profiles(id) ON DELETE CASCADE NOT NULL,
  nama_vendor   TEXT NOT NULL,
  layanan       TEXT,
  harga         BIGINT DEFAULT 0,
  status_bayar  TEXT DEFAULT 'Belum',
  status_kerja  TEXT DEFAULT 'Belum',
  catatan       TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── 19. CINCIN & MAHAR ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS cincin_mahar (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id        UUID REFERENCES wedding_profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  -- Mahar
  jenis_mahar       TEXT,
  nominal_mahar     BIGINT DEFAULT 0,
  barang_mahar      TEXT,
  penyajian_mahar   TEXT,
  vendor_mahar      TEXT,
  harga_mahar       BIGINT DEFAULT 0,
  status_mahar      TEXT DEFAULT 'Belum',
  -- Cincin
  ukuran_cincin_1   TEXT,
  ukuran_cincin_2   TEXT,
  bahan_cincin      TEXT,
  desain_cincin     TEXT,
  vendor_cincin     TEXT,
  harga_cincin      BIGINT DEFAULT 0,
  tanggal_ambil     DATE,
  status_cincin     TEXT DEFAULT 'Belum',
  -- Checklist akad (JSON)
  checklist_akad    JSONB DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── 20. HONEYMOON INFO (BARU — terpisah dari wedding_profiles) ──
CREATE TABLE IF NOT EXISTS honeymoon_info (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id   UUID REFERENCES wedding_profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  destinasi    TEXT,
  durasi       TEXT,
  total_budget BIGINT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── 21. HONEYMOON ITINERARY ──────────────────────────────────
CREATE TABLE IF NOT EXISTS honeymoon_itinerary (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id      UUID REFERENCES wedding_profiles(id) ON DELETE CASCADE NOT NULL,
  hari            TEXT,
  aktivitas       TEXT NOT NULL,
  lokasi          TEXT,
  estimasi_biaya  BIGINT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── 22. HONEYMOON BOOKING ────────────────────────────────────
CREATE TABLE IF NOT EXISTS honeymoon_booking (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id  UUID REFERENCES wedding_profiles(id) ON DELETE CASCADE NOT NULL,
  item        TEXT NOT NULL,
  detail      TEXT,
  harga       BIGINT DEFAULT 0,
  status      TEXT DEFAULT 'Belum',
  catatan     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 23. SOUVENIR VENDOR (FIXED — tanpa UNIQUE pada wedding_id) ──
CREATE TABLE IF NOT EXISTS souvenir_vendor (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id      UUID REFERENCES wedding_profiles(id) ON DELETE CASCADE NOT NULL,
  nama_vendor     TEXT,
  pic_nama        TEXT,
  pic_hp          TEXT,
  jenis_souvenir  TEXT,
  total_dipesan   INT DEFAULT 0,
  harga_satuan    BIGINT DEFAULT 0,
  deadline_ambil  DATE,
  status_bayar    TEXT DEFAULT 'Belum',
  checklist_items JSONB DEFAULT '{}',
  catatan         TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── 24. SOUVENIR DISTRIBUSI ──────────────────────────────────
CREATE TABLE IF NOT EXISTS souvenir_distribusi (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id          UUID REFERENCES wedding_profiles(id) ON DELETE CASCADE NOT NULL,
  kategori            TEXT NOT NULL,
  jumlah              INT DEFAULT 0,
  sudah_distribusi    INT DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Pastikan setiap user hanya bisa akses data miliknya sendiri
-- ============================================================

-- Enable RLS untuk semua tabel
ALTER TABLE wedding_profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items          ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_payments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE seserahan_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE kado_angpao           ENABLE ROW LEVEL SECURITY;
ALTER TABLE tamu_undangan         ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors               ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events       ENABLE ROW LEVEL SECURITY;
ALTER TABLE catatan               ENABLE ROW LEVEL SECURITY;
ALTER TABLE katering_vendor       ENABLE ROW LEVEL SECURITY;
ALTER TABLE katering_menu         ENABLE ROW LEVEL SECURITY;
ALTER TABLE mua_detail            ENABLE ROW LEVEL SECURITY;
ALTER TABLE mua_jadwal            ENABLE ROW LEVEL SECURITY;
ALTER TABLE aksesori_busana       ENABLE ROW LEVEL SECURITY;
ALTER TABLE dokumentasi_vendor    ENABLE ROW LEVEL SECURITY;
ALTER TABLE shot_list             ENABLE ROW LEVEL SECURITY;
ALTER TABLE dekorasi_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE undangan_vendor       ENABLE ROW LEVEL SECURITY;
ALTER TABLE cincin_mahar          ENABLE ROW LEVEL SECURITY;
ALTER TABLE honeymoon_info        ENABLE ROW LEVEL SECURITY;
ALTER TABLE honeymoon_itinerary   ENABLE ROW LEVEL SECURITY;
ALTER TABLE honeymoon_booking     ENABLE ROW LEVEL SECURITY;
ALTER TABLE souvenir_vendor       ENABLE ROW LEVEL SECURITY;
ALTER TABLE souvenir_distribusi   ENABLE ROW LEVEL SECURITY;

-- ── RLS: wedding_profiles ────────────────────────────────────
CREATE POLICY "Users can manage own wedding profile"
  ON wedding_profiles FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── Helper function: get wedding_id dari user ────────────────
CREATE OR REPLACE FUNCTION get_wedding_id()
RETURNS UUID AS $$
  SELECT id FROM wedding_profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER;

-- ── RLS Policy Generator untuk tabel yang pakai wedding_id ──
-- budget_items
CREATE POLICY "Users manage own budget_items"
  ON budget_items FOR ALL
  USING (wedding_id = get_wedding_id())
  WITH CHECK (wedding_id = get_wedding_id());

-- budget_payments (BARU)
CREATE POLICY "Users manage own budget_payments"
  ON budget_payments FOR ALL
  USING (wedding_id = get_wedding_id())
  WITH CHECK (wedding_id = get_wedding_id());

-- seserahan_items
CREATE POLICY "Users manage own seserahan_items"
  ON seserahan_items FOR ALL
  USING (wedding_id = get_wedding_id())
  WITH CHECK (wedding_id = get_wedding_id());

-- kado_angpao
CREATE POLICY "Users manage own kado_angpao"
  ON kado_angpao FOR ALL
  USING (wedding_id = get_wedding_id())
  WITH CHECK (wedding_id = get_wedding_id());

-- tamu_undangan
CREATE POLICY "Users manage own tamu_undangan"
  ON tamu_undangan FOR ALL
  USING (wedding_id = get_wedding_id())
  WITH CHECK (wedding_id = get_wedding_id());

-- vendors
CREATE POLICY "Users manage own vendors"
  ON vendors FOR ALL
  USING (wedding_id = get_wedding_id())
  WITH CHECK (wedding_id = get_wedding_id());

-- checklist_items
CREATE POLICY "Users manage own checklist_items"
  ON checklist_items FOR ALL
  USING (wedding_id = get_wedding_id())
  WITH CHECK (wedding_id = get_wedding_id());

-- timeline_events
CREATE POLICY "Users manage own timeline_events"
  ON timeline_events FOR ALL
  USING (wedding_id = get_wedding_id())
  WITH CHECK (wedding_id = get_wedding_id());

-- catatan
CREATE POLICY "Users manage own catatan"
  ON catatan FOR ALL
  USING (wedding_id = get_wedding_id())
  WITH CHECK (wedding_id = get_wedding_id());

-- katering_vendor
CREATE POLICY "Users manage own katering_vendor"
  ON katering_vendor FOR ALL
  USING (wedding_id = get_wedding_id())
  WITH CHECK (wedding_id = get_wedding_id());

-- katering_menu
CREATE POLICY "Users manage own katering_menu"
  ON katering_menu FOR ALL
  USING (wedding_id = get_wedding_id())
  WITH CHECK (wedding_id = get_wedding_id());

-- mua_detail
CREATE POLICY "Users manage own mua_detail"
  ON mua_detail FOR ALL
  USING (wedding_id = get_wedding_id())
  WITH CHECK (wedding_id = get_wedding_id());

-- mua_jadwal
CREATE POLICY "Users manage own mua_jadwal"
  ON mua_jadwal FOR ALL
  USING (wedding_id = get_wedding_id())
  WITH CHECK (wedding_id = get_wedding_id());

-- aksesori_busana
CREATE POLICY "Users manage own aksesori_busana"
  ON aksesori_busana FOR ALL
  USING (wedding_id = get_wedding_id())
  WITH CHECK (wedding_id = get_wedding_id());

-- dokumentasi_vendor
CREATE POLICY "Users manage own dokumentasi_vendor"
  ON dokumentasi_vendor FOR ALL
  USING (wedding_id = get_wedding_id())
  WITH CHECK (wedding_id = get_wedding_id());

-- shot_list
CREATE POLICY "Users manage own shot_list"
  ON shot_list FOR ALL
  USING (wedding_id = get_wedding_id())
  WITH CHECK (wedding_id = get_wedding_id());

-- dekorasi_items
CREATE POLICY "Users manage own dekorasi_items"
  ON dekorasi_items FOR ALL
  USING (wedding_id = get_wedding_id())
  WITH CHECK (wedding_id = get_wedding_id());

-- undangan_vendor
CREATE POLICY "Users manage own undangan_vendor"
  ON undangan_vendor FOR ALL
  USING (wedding_id = get_wedding_id())
  WITH CHECK (wedding_id = get_wedding_id());

-- cincin_mahar
CREATE POLICY "Users manage own cincin_mahar"
  ON cincin_mahar FOR ALL
  USING (wedding_id = get_wedding_id())
  WITH CHECK (wedding_id = get_wedding_id());

-- honeymoon_info (BARU)
CREATE POLICY "Users manage own honeymoon_info"
  ON honeymoon_info FOR ALL
  USING (wedding_id = get_wedding_id())
  WITH CHECK (wedding_id = get_wedding_id());

-- honeymoon_itinerary
CREATE POLICY "Users manage own honeymoon_itinerary"
  ON honeymoon_itinerary FOR ALL
  USING (wedding_id = get_wedding_id())
  WITH CHECK (wedding_id = get_wedding_id());

-- honeymoon_booking
CREATE POLICY "Users manage own honeymoon_booking"
  ON honeymoon_booking FOR ALL
  USING (wedding_id = get_wedding_id())
  WITH CHECK (wedding_id = get_wedding_id());

-- souvenir_vendor
CREATE POLICY "Users manage own souvenir_vendor"
  ON souvenir_vendor FOR ALL
  USING (wedding_id = get_wedding_id())
  WITH CHECK (wedding_id = get_wedding_id());

-- souvenir_distribusi
CREATE POLICY "Users manage own souvenir_distribusi"
  ON souvenir_distribusi FOR ALL
  USING (wedding_id = get_wedding_id())
  WITH CHECK (wedding_id = get_wedding_id());

-- ============================================================
-- INDEXES (untuk performa query)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_budget_items_wedding       ON budget_items(wedding_id);
CREATE INDEX IF NOT EXISTS idx_budget_items_tipe          ON budget_items(tipe);
CREATE INDEX IF NOT EXISTS idx_budget_payments_item       ON budget_payments(budget_item_id);
CREATE INDEX IF NOT EXISTS idx_budget_payments_wedding    ON budget_payments(wedding_id);
CREATE INDEX IF NOT EXISTS idx_seserahan_wedding          ON seserahan_items(wedding_id);
CREATE INDEX IF NOT EXISTS idx_kado_angpao_wedding        ON kado_angpao(wedding_id);
CREATE INDEX IF NOT EXISTS idx_tamu_undangan_wedding      ON tamu_undangan(wedding_id);
CREATE INDEX IF NOT EXISTS idx_vendors_wedding            ON vendors(wedding_id);
CREATE INDEX IF NOT EXISTS idx_checklist_wedding          ON checklist_items(wedding_id);
CREATE INDEX IF NOT EXISTS idx_timeline_wedding           ON timeline_events(wedding_id);
CREATE INDEX IF NOT EXISTS idx_catatan_wedding            ON catatan(wedding_id);
CREATE INDEX IF NOT EXISTS idx_katering_menu_wedding      ON katering_menu(wedding_id);
CREATE INDEX IF NOT EXISTS idx_mua_jadwal_wedding         ON mua_jadwal(wedding_id);
CREATE INDEX IF NOT EXISTS idx_shot_list_wedding          ON shot_list(wedding_id);
CREATE INDEX IF NOT EXISTS idx_dekorasi_wedding           ON dekorasi_items(wedding_id);
CREATE INDEX IF NOT EXISTS idx_undangan_vendor_wedding    ON undangan_vendor(wedding_id);
CREATE INDEX IF NOT EXISTS idx_hm_itinerary_wedding       ON honeymoon_itinerary(wedding_id);
CREATE INDEX IF NOT EXISTS idx_hm_booking_wedding         ON honeymoon_booking(wedding_id);
CREATE INDEX IF NOT EXISTS idx_souvenir_vendor_wedding    ON souvenir_vendor(wedding_id);
CREATE INDEX IF NOT EXISTS idx_souvenir_dist_wedding      ON souvenir_distribusi(wedding_id);

-- ============================================================
-- AUTO UPDATE updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Terapkan trigger ke semua tabel yang punya updated_at
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'wedding_profiles','budget_items','seserahan_items','kado_angpao',
    'tamu_undangan','vendors','checklist_items','timeline_events','catatan',
    'katering_vendor','mua_detail','dokumentasi_vendor','dekorasi_items',
    'undangan_vendor','cincin_mahar','honeymoon_info','honeymoon_booking',
    'souvenir_vendor','souvenir_distribusi'
  ]
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS trg_updated_at ON %I;
      CREATE TRIGGER trg_updated_at
        BEFORE UPDATE ON %I
        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
    ', t, t);
  END LOOP;
END;
$$;

-- ============================================================
-- SELESAI!
-- Total: 24 tabel + RLS + Indexes + Triggers
-- 
-- PERUBAHAN dari v1:
-- ✅ Tambah tabel: budget_payments (histori pembayaran per budget item)
-- ✅ Tambah tabel: honeymoon_info (terpisah dari wedding_profiles)
-- ✅ Tambah kolom: budget_items.tipe, budget_items.file_url
-- ✅ Tambah kolom: vendors.kontrak_url
-- ✅ Tambah kolom: souvenir_vendor.checklist_items (JSONB)
-- ✅ Hapus UNIQUE constraint: souvenir_vendor.wedding_id (support multi-vendor)
-- ✅ Hapus kolom duplikat: wedding_profiles.hm_*, tema_dekorasi, moodboard_notes
-- ✅ Hapus tabel: souvenir_checklist (tidak digunakan frontend, diganti JSONB)
-- ============================================================
