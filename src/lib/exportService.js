// src/lib/exportService.js
import * as XLSX from 'xlsx'

/**
 * Service untuk export data ke format Excel (.xlsx)
 * Digunakan di seluruh modul Nikah Rapi
 */

const rp = (n = 0) => Number(n).toLocaleString('id-ID')

/**
 * Helper: Buat dan download file Excel
 */
function downloadWorkbook(wb, filename) {
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

/**
 * Helper: Buat worksheet dari array of objects dengan header custom
 */
function createSheet(data, columns) {
  const header = columns.map(c => c.label)
  const rows = data.map(item =>
    columns.map(c => c.format ? c.format(item[c.key], item) : item[c.key] ?? '')
  )
  return XLSX.utils.aoa_to_sheet([header, ...rows])
}

/**
 * Style helper: Set column widths
 */
function setColWidths(ws, widths) {
  ws['!cols'] = widths.map(w => ({ wch: w }))
}

// ──────────────────────────────────────────────
// EXPORT FUNCTIONS PER MODULE
// ──────────────────────────────────────────────

export const exportService = {

  /**
   * Export Budget Planner ke Excel
   */
  exportBudget(items, totalBudget = 0) {
    const wb = XLSX.utils.book_new()

    const columns = [
      { key: 'kategori', label: 'Kategori' },
      { key: 'tipe', label: 'Tipe' },
      { key: 'jumlah_estimasi', label: 'Estimasi (Rp)', format: v => rp(v) },
      { key: 'jumlah_aktual', label: 'Aktual (Rp)', format: v => rp(v) },
      { key: 'catatan', label: 'Catatan' },
    ]

    const ws = createSheet(items, columns)
    setColWidths(ws, [25, 15, 20, 20, 35])

    // Tambah summary row
    const lastRow = items.length + 2
    const totalEst = items.reduce((a, i) => a + (i.jumlah_estimasi || 0), 0)
    const totalAkt = items.reduce((a, i) => a + (i.jumlah_aktual || 0), 0)
    XLSX.utils.sheet_add_aoa(ws, [
      [],
      ['TOTAL', '', rp(totalEst), rp(totalAkt), ''],
      ['ANGGARAN UTAMA', '', rp(totalBudget), '', ''],
      ['SISA ANGGARAN', '', rp(totalBudget - totalAkt), '', ''],
    ], { origin: `A${lastRow}` })

    XLSX.utils.book_append_sheet(wb, ws, 'Budget Planner')
    downloadWorkbook(wb, `NikahRapi_Budget_${new Date().toISOString().split('T')[0]}`)
  },

  /**
   * Export Daftar Tamu ke Excel
   */
  exportGuestList(items) {
    const wb = XLSX.utils.book_new()

    const columns = [
      { key: 'nama', label: 'Nama Tamu' },
      { key: 'hubungan', label: 'Hubungan' },
      { key: 'no_hp', label: 'No. HP' },
      { key: 'asal_kota', label: 'Asal Kota' },
      { key: 'jumlah_orang', label: 'Jumlah Orang' },
      { key: 'no_meja', label: 'No. Meja' },
      { key: 'status_rsvp', label: 'Status RSVP' },
      { key: 'kupon_makan', label: 'Kupon Makan', format: v => v ? '✓' : '—' },
      { key: 'catatan', label: 'Catatan' },
    ]

    const ws = createSheet(items, columns)
    setColWidths(ws, [30, 15, 18, 18, 14, 12, 14, 14, 30])

    // Summary
    const lastRow = items.length + 2
    const hadir = items.filter(i => i.status_rsvp === 'hadir').length
    const totalOrang = items.reduce((a, i) => a + (i.jumlah_orang || 1), 0)
    XLSX.utils.sheet_add_aoa(ws, [
      [],
      ['TOTAL UNDANGAN', '', '', '', items.length, '', '', '', ''],
      ['KONFIRMASI HADIR', '', '', '', hadir, '', '', '', ''],
      ['TOTAL ORANG', '', '', '', totalOrang, '', '', '', ''],
    ], { origin: `A${lastRow}` })

    XLSX.utils.book_append_sheet(wb, ws, 'Daftar Tamu')
    downloadWorkbook(wb, `NikahRapi_DaftarTamu_${new Date().toISOString().split('T')[0]}`)
  },

  /**
   * Export Seserahan ke Excel
   */
  exportSeserahan(items) {
    const wb = XLSX.utils.book_new()

    const columns = [
      { key: 'nama', label: 'Nama Item' },
      { key: 'kategori', label: 'Kategori' },
      { key: 'estimasi', label: 'Estimasi (Rp)', format: v => rp(v) },
      { key: 'aktual', label: 'Aktual (Rp)', format: v => rp(v) },
      { key: 'tempat_beli', label: 'Tempat Beli' },
      { key: 'status', label: 'Status' },
      { key: 'catatan', label: 'Catatan' },
    ]

    const ws = createSheet(items, columns)
    setColWidths(ws, [25, 18, 20, 20, 25, 15, 30])

    XLSX.utils.book_append_sheet(wb, ws, 'Seserahan')
    downloadWorkbook(wb, `NikahRapi_Seserahan_${new Date().toISOString().split('T')[0]}`)
  },

  /**
   * Export Kado & Angpao ke Excel
   */
  exportKadoAngpao(items) {
    const wb = XLSX.utils.book_new()

    const columns = [
      { key: 'nama', label: 'Nama Pemberi' },
      { key: 'hubungan', label: 'Hubungan' },
      { key: 'jenis', label: 'Jenis' },
      { key: 'nominal', label: 'Nominal (Rp)', format: v => rp(v) },
      { key: 'deskripsi_kado', label: 'Deskripsi Kado' },
      { key: 'sesi', label: 'Sesi' },
      { key: 'sudah_ucapkan', label: 'Terima Kasih', format: v => v ? '✓' : '—' },
    ]

    const ws = createSheet(items, columns)
    setColWidths(ws, [25, 15, 12, 20, 30, 12, 14])

    const lastRow = items.length + 2
    const totalAngpao = items.filter(i => i.jenis === 'Angpao' || i.jenis === 'Keduanya').reduce((a, i) => a + (i.nominal || 0), 0)
    XLSX.utils.sheet_add_aoa(ws, [
      [],
      ['TOTAL ANGPAO', '', '', rp(totalAngpao), '', '', ''],
      ['TOTAL PEMBERI', '', '', items.length, '', '', ''],
    ], { origin: `A${lastRow}` })

    XLSX.utils.book_append_sheet(wb, ws, 'Kado & Angpao')
    downloadWorkbook(wb, `NikahRapi_KadoAngpao_${new Date().toISOString().split('T')[0]}`)
  },

  /**
   * Export Vendor ke Excel
   */
  exportVendors(items) {
    const wb = XLSX.utils.book_new()

    const columns = [
      { key: 'nama', label: 'Nama Vendor' },
      { key: 'kategori', label: 'Kategori' },
      { key: 'pic_nama', label: 'PIC' },
      { key: 'pic_hp', label: 'No. HP PIC' },
      { key: 'total', label: 'Total (Rp)', format: v => rp(v) },
      { key: 'dp', label: 'DP (Rp)', format: v => rp(v) },
      { key: 'deadline_pelunasan', label: 'Deadline Pelunasan' },
      { key: 'status_kontrak', label: 'Status Kontrak' },
      { key: 'catatan', label: 'Catatan' },
    ]

    const ws = createSheet(items, columns)
    setColWidths(ws, [25, 18, 20, 18, 20, 20, 20, 18, 30])

    XLSX.utils.book_append_sheet(wb, ws, 'Vendor')
    downloadWorkbook(wb, `NikahRapi_Vendor_${new Date().toISOString().split('T')[0]}`)
  },

  /**
   * Export Checklist ke Excel
   */
  exportChecklist(items) {
    const wb = XLSX.utils.book_new()

    const columns = [
      { key: 'task', label: 'Tugas' },
      { key: 'kategori', label: 'Kategori' },
      { key: 'deadline', label: 'Deadline' },
      { key: 'pic', label: 'PIC' },
      { key: 'priority', label: 'Prioritas' },
      { key: 'is_done', label: 'Selesai', format: v => v ? '✓' : '—' },
    ]

    const ws = createSheet(items, columns)
    setColWidths(ws, [35, 18, 18, 20, 14, 10])

    XLSX.utils.book_append_sheet(wb, ws, 'Checklist')
    downloadWorkbook(wb, `NikahRapi_Checklist_${new Date().toISOString().split('T')[0]}`)
  },

  /**
   * Export Timeline ke Excel
   */
  exportTimeline(items) {
    const wb = XLSX.utils.book_new()

    const columns = [
      { key: 'sesi', label: 'Sesi' },
      { key: 'waktu', label: 'Waktu' },
      { key: 'durasi_menit', label: 'Durasi (Menit)' },
      { key: 'event', label: 'Acara' },
      { key: 'lokasi', label: 'Lokasi' },
      { key: 'status', label: 'Status' },
      { key: 'catatan', label: 'Catatan' },
    ]

    const ws = createSheet(items, columns)
    setColWidths(ws, [20, 12, 14, 30, 25, 12, 30])

    XLSX.utils.book_append_sheet(wb, ws, 'Timeline Acara')
    downloadWorkbook(wb, `NikahRapi_Timeline_${new Date().toISOString().split('T')[0]}`)
  },

  /**
   * Export REKAP LENGKAP — Semua data dalam 1 file multi-sheet
   */
  exportRekapLengkap({ budget, guests, vendors, seserahan, angpao, checklist, timeline, weddingProfile }) {
    const wb = XLSX.utils.book_new()
    const rp = (n = 0) => Number(n).toLocaleString('id-ID')

    // ── Sheet 1: Ringkasan ──
    const summaryData = [
      ['NIKAH RAPI — Rekap Lengkap Pernikahan'],
      [],
      ['Pengantin 1', weddingProfile?.nama_pengantin_1 || '—'],
      ['Pengantin 2', weddingProfile?.nama_pengantin_2 || '—'],
      ['Tanggal Pernikahan', weddingProfile?.tanggal_pernikahan || '—'],
      ['Lokasi Akad', weddingProfile?.lokasi_akad || '—'],
      ['Lokasi Resepsi', weddingProfile?.lokasi_resepsi || '—'],
      [],
      ['Total Budget', rp(weddingProfile?.total_budget)],
      ['Total Realisasi', rp((budget || []).reduce((a, i) => a + (i.jumlah_aktual || 0), 0))],
      ['Total Tamu', (guests || []).length],
      ['Total Vendor', (vendors || []).length],
      ['Total Seserahan', (seserahan || []).length],
      ['Total Angpao', rp((angpao || []).filter(a => a.jenis === 'Angpao' || a.jenis === 'Keduanya').reduce((a, i) => a + (i.nominal || 0), 0))],
      [],
      [`Digenerate pada: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`],
    ]
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData)
    setColWidths(wsSummary, [25, 35])
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan')

    // ── Sheet 2: Budget ──
    if (budget && budget.length > 0) {
      const wsBudget = createSheet(budget, [
        { key: 'kategori', label: 'Kategori' },
        { key: 'tipe', label: 'Tipe' },
        { key: 'jumlah_estimasi', label: 'Estimasi (Rp)', format: v => rp(v) },
        { key: 'jumlah_aktual', label: 'Aktual (Rp)', format: v => rp(v) },
        { key: 'catatan', label: 'Catatan' },
      ])
      setColWidths(wsBudget, [25, 15, 20, 20, 35])
      XLSX.utils.book_append_sheet(wb, wsBudget, 'Budget')
    }

    // ── Sheet 3: Daftar Tamu ──
    if (guests && guests.length > 0) {
      const wsGuest = createSheet(guests, [
        { key: 'nama', label: 'Nama' },
        { key: 'hubungan', label: 'Hubungan' },
        { key: 'no_hp', label: 'No. HP' },
        { key: 'jumlah_orang', label: 'Jumlah' },
        { key: 'status_rsvp', label: 'RSVP' },
        { key: 'no_meja', label: 'Meja' },
      ])
      setColWidths(wsGuest, [30, 15, 18, 12, 12, 10])
      XLSX.utils.book_append_sheet(wb, wsGuest, 'Tamu')
    }

    // ── Sheet 4: Vendor ──
    if (vendors && vendors.length > 0) {
      const wsVendor = createSheet(vendors, [
        { key: 'nama', label: 'Nama' },
        { key: 'kategori', label: 'Kategori' },
        { key: 'total', label: 'Total (Rp)', format: v => rp(v) },
        { key: 'dp', label: 'DP (Rp)', format: v => rp(v) },
        { key: 'status_kontrak', label: 'Status' },
      ])
      setColWidths(wsVendor, [25, 18, 20, 20, 18])
      XLSX.utils.book_append_sheet(wb, wsVendor, 'Vendor')
    }

    // ── Sheet 5: Seserahan ──
    if (seserahan && seserahan.length > 0) {
      const wsSes = createSheet(seserahan, [
        { key: 'nama', label: 'Item' },
        { key: 'kategori', label: 'Kategori' },
        { key: 'estimasi', label: 'Estimasi (Rp)', format: v => rp(v) },
        { key: 'aktual', label: 'Aktual (Rp)', format: v => rp(v) },
        { key: 'status', label: 'Status' },
      ])
      setColWidths(wsSes, [25, 18, 20, 20, 15])
      XLSX.utils.book_append_sheet(wb, wsSes, 'Seserahan')
    }

    // ── Sheet 6: Kado & Angpao ──
    if (angpao && angpao.length > 0) {
      const wsAng = createSheet(angpao, [
        { key: 'nama', label: 'Pemberi' },
        { key: 'hubungan', label: 'Hubungan' },
        { key: 'jenis', label: 'Jenis' },
        { key: 'nominal', label: 'Nominal (Rp)', format: v => rp(v) },
      ])
      setColWidths(wsAng, [25, 15, 12, 20])
      XLSX.utils.book_append_sheet(wb, wsAng, 'Kado & Angpao')
    }

    // ── Sheet 7: Checklist ──
    if (checklist && checklist.length > 0) {
      const wsChk = createSheet(checklist, [
        { key: 'task', label: 'Tugas' },
        { key: 'kategori', label: 'Kategori' },
        { key: 'priority', label: 'Prioritas' },
        { key: 'is_done', label: 'Selesai', format: v => v ? '✓' : '—' },
      ])
      setColWidths(wsChk, [35, 18, 14, 10])
      XLSX.utils.book_append_sheet(wb, wsChk, 'Checklist')
    }

    // ── Sheet 8: Timeline ──
    if (timeline && timeline.length > 0) {
      const wsTl = createSheet(timeline, [
        { key: 'sesi', label: 'Sesi' },
        { key: 'waktu', label: 'Waktu' },
        { key: 'event', label: 'Acara' },
        { key: 'lokasi', label: 'Lokasi' },
        { key: 'status', label: 'Status' },
      ])
      setColWidths(wsTl, [20, 12, 30, 25, 12])
      XLSX.utils.book_append_sheet(wb, wsTl, 'Timeline')
    }

    downloadWorkbook(wb, `NikahRapi_RekapLengkap_${new Date().toISOString().split('T')[0]}`)
  },
}
