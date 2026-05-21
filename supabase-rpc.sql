-- Jalankan di Supabase > SQL Editor

-- 1. Budget summary (ganti fetch semua budget_items lalu .reduce() di client)
create or replace function get_budget_summary(p_wedding_id uuid)
returns json language sql as $$
  select json_build_object(
    'total_estimasi', coalesce(sum(jumlah_estimasi), 0),
    'total_realisasi', coalesce(sum(jumlah_aktual), 0),
    'sisa', coalesce(sum(jumlah_estimasi), 0) - coalesce(sum(jumlah_aktual), 0)
  ) from budget_items where wedding_id = p_wedding_id;
$$;

-- 2. Vendor summary
create or replace function get_vendor_summary(p_wedding_id uuid)
returns json language sql as $$
  select json_build_object(
    'total_vendor', count(*),
    'total_kontrak', coalesce(sum(total), 0),
    'total_dp', coalesce(sum(dp), 0),
    'sisa_pelunasan', coalesce(sum(total), 0) - coalesce(sum(dp), 0)
  ) from vendors where wedding_id = p_wedding_id;
$$;

-- 3. Guest summary
create or replace function get_guest_summary(p_wedding_id uuid)
returns json language sql as $$
  select json_build_object(
    'total_tamu', count(*),
    'total_hadir', count(*) filter (where status_rsvp = 'hadir'),
    'total_tidak_hadir', count(*) filter (where status_rsvp = 'tidak_hadir'),
    'total_pax', coalesce(sum(jumlah_orang), 0)
  ) from tamu_undangan where wedding_id = p_wedding_id;
$$;

-- Cara pakai di client (contoh):
-- const { data } = await supabase.rpc('get_budget_summary', { p_wedding_id: wedding.id })
-- data = { total_estimasi: ..., total_realisasi: ..., sisa: ... }
