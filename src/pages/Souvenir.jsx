// src/pages/Souvenir.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useWedding } from '../hooks/useWedding'
import { confirmDelete } from '../lib/swal'
import toast from 'react-hot-toast'
import { syncService } from '../lib/syncService'

const rp = (n = 0) => 'Rp ' + Number(n).toLocaleString('id-ID')
const STATUS_BAYAR = ['Belum', 'DP 50%', 'Lunas']
const CHECKLIST_ITEMS = ['Desain disetujui', 'Sample OK', 'Pelunasan selesai', 'Semua souvenir diterima', 'Distribusi ke tamu selesai']
const KATEGORI_PENERIMA = ['Tamu Akad', 'Tamu Resepsi', 'Hampers VIP']

const EMPTY_FORM_V = { nama_vendor: '', pic_nama: '', pic_hp: '', jenis_souvenir: '', total_dipesan: '', harga_satuan: '', deadline_ambil: '', status_bayar: 'Belum' }

export default function Souvenir() {
    const { wedding } = useWedding()
    const [vendors, setVendors] = useState([])        // ← list semua vendor
    const [distribusi, setDistribusi] = useState([])
    const [checklist, setChecklist] = useState({})

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [modalV, setModalV] = useState(false)
    const [modalD, setModalD] = useState(false)
    const [formV, setFormV] = useState(EMPTY_FORM_V)
    const [formD, setFormD] = useState({ kategori: KATEGORI_PENERIMA[0], jumlah: '', sudah_distribusi: '' })
    const [editVId, setEditVId] = useState(null)      // ← track edit vendor
    const [editDId, setEditDId] = useState(null)

    useEffect(() => { if (wedding) fetchData() }, [wedding])

    const fetchData = async () => {
        setLoading(true)
        if (wedding.id === 'dummy-wedding-id') {
            setVendors([
                { id: 1, nama_vendor: 'Kado Kita Souvenir', pic_nama: 'Ibu Sari', pic_hp: '0812345678', jenis_souvenir: 'Diffuser Kayu Premium', total_dipesan: 300, harga_satuan: 25000, deadline_ambil: '2026-08-01', status_bayar: 'DP 50%', checklist_items: { 'Desain disetujui': true, 'Sample OK': true, 'Pelunasan selesai': false, 'Semua souvenir diterima': false, 'Distribusi ke tamu selesai': false } },
                { id: 2, nama_vendor: 'Hampers Luxury', pic_nama: 'Bpk. Budi', pic_hp: '0856789012', jenis_souvenir: 'Set Keramik Premium (VIP)', total_dipesan: 50, harga_satuan: 150000, deadline_ambil: '2026-08-15', status_bayar: 'Lunas', checklist_items: { 'Desain disetujui': true, 'Sample OK': true, 'Pelunasan selesai': true, 'Semua souvenir diterima': true, 'Distribusi ke tamu selesai': false } },
            ])
            setChecklist({ 'Desain disetujui': true, 'Sample OK': true, 'Pelunasan selesai': false, 'Semua souvenir diterima': false, 'Distribusi ke tamu selesai': false })
            setDistribusi([
                { id: 1, kategori: 'Tamu Akad', jumlah: 100, sudah_distribusi: 0 },
                { id: 2, kategori: 'Tamu Resepsi', jumlah: 250, sudah_distribusi: 0 },
                { id: 3, kategori: 'Hampers VIP', jumlah: 50, sudah_distribusi: 10 },
            ])
            setLoading(false)
            return
        }
        const [vRes, dRes] = await Promise.all([
            supabase.from('souvenir_vendor').select('*').eq('wedding_id', wedding.id).order('created_at'),
            supabase.from('souvenir_distribusi').select('*').eq('wedding_id', wedding.id).order('created_at')
        ])
        if (vRes.error) console.error('Vendor fetch error:', vRes.error)
        setVendors(vRes.data || [])
        if (vRes.data && vRes.data.length > 0) {
            setChecklist(vRes.data[0].checklist_items || {})
        }
        setDistribusi(dRes.data || [])
        setLoading(false)
    }

    // ── Vendor handlers ──────────────────────────────────────────────────────
    const openAddVendor = () => {
        setFormV(EMPTY_FORM_V)
        setEditVId(null)
        setModalV(true)
    }

    const openEditVendor = (v) => {
        setFormV(v)
        setEditVId(v.id)
        setModalV(true)
    }

    const saveVendor = async () => {
        if (!formV.nama_vendor.trim()) {
            toast.error('Nama vendor wajib diisi!')
            return
        }
        setSaving(true)
        const payload = {
            nama_vendor: formV.nama_vendor,
            pic_nama: formV.pic_nama,
            pic_hp: formV.pic_hp,
            jenis_souvenir: formV.jenis_souvenir,
            total_dipesan: Number(formV.total_dipesan) || 0,
            harga_satuan: Number(formV.harga_satuan) || 0,
            deadline_ambil: formV.deadline_ambil || null,
            status_bayar: formV.status_bayar,
            checklist_items: checklist,
            wedding_id: wedding.id
        }

        try {
            let res
            if (editVId) {
                res = await supabase.from('souvenir_vendor').update(payload).eq('id', editVId)
            } else {
                res = await supabase.from('souvenir_vendor').insert(payload)
            }

            if (res.error) throw res.error

            // --- INVERSE SYNC TO BUDGET ---
            const { data: allItems } = await supabase.from('souvenir_vendor').select('total_dipesan, harga_satuan').eq('wedding_id', wedding.id)
            const newTotal = (allItems || []).reduce((sum, v) => sum + ((v.total_dipesan || 0) * (v.harga_satuan || 0)), 0)

            await syncService.syncToBudget(
                wedding.id, 
                'souvenir', 
                'Souvenir & Hampers', 
                newTotal, 
                0
            )

            toast.success(editVId ? 'Vendor & Budget diperbarui! ✨' : 'Vendor & Budget ditambahkan! ✨')
            setModalV(false)
            await fetchData()
        } catch (error) {
            console.error(error)
            toast.error('Gagal sinkronisasi budget')
        } finally {
            setSaving(false)
        }
    }

    const deleteVendor = async (id) => {
        const result = await confirmDelete('Hapus Vendor?', 'Data vendor ini akan dihapus secara permanen.')
        if (!result.isConfirmed) return
        const res = await supabase.from('souvenir_vendor').delete().eq('id', id)
        if (res.error) {
            toast.error('Gagal hapus: ' + res.error.message)
            return
        }
        toast.success('Vendor dihapus!')
        fetchData()
    }

    const toggleChecklist = async (item, vendorId) => {
        const newVal = !checklist[item]
        const newChecklist = { ...checklist, [item]: newVal }
        setChecklist(newChecklist)
        await supabase.from('souvenir_vendor').update({ checklist_items: newChecklist }).eq('id', vendorId)
    }

    // ── Distribusi handlers ──────────────────────────────────────────────────
    const openAddD = () => { setFormD({ kategori: KATEGORI_PENERIMA[0], jumlah: '', sudah_distribusi: '' }); setEditDId(null); setModalD(true) }
    const openEditD = (d) => { setFormD({ kategori: d.kategori, jumlah: d.jumlah, sudah_distribusi: d.sudah_distribusi }); setEditDId(d.id); setModalD(true) }

    const saveDistribusi = async () => {
        setSaving(true)
        const payload = { ...formD, jumlah: Number(formD.jumlah) || 0, sudah_distribusi: Number(formD.sudah_distribusi) || 0, wedding_id: wedding.id }
        if (editDId) await supabase.from('souvenir_distribusi').update(payload).eq('id', editDId)
        else await supabase.from('souvenir_distribusi').insert(payload)
        toast.success('Distribusi disimpan!')
        setModalD(false); fetchData(); setSaving(false)
    }

    const deleteDistribusi = async (id) => {
        const result = await confirmDelete('Hapus Distribusi?', 'Data distribusi ini akan dihapus secara permanen.')
        if (!result.isConfirmed) return
        await supabase.from('souvenir_distribusi').delete().eq('id', id)
        toast.success('Distribusi dihapus!')
        fetchData()
    }

    // ── Computed ─────────────────────────────────────────────────────────────
    const totalBiaya = vendors.reduce((sum, v) => sum + ((v.total_dipesan || 0) * (v.harga_satuan || 0)), 0)
    const totalUnit = vendors.reduce((sum, v) => sum + (v.total_dipesan || 0), 0)
    const totalDistribusi = distribusi.reduce((sum, d) => sum + (d.sudah_distribusi || 0), 0)
    const checkDone = CHECKLIST_ITEMS.filter(i => checklist[i]).length
    const firstVendor = vendors[0] || null

    if (loading) return <div className="text-center py-20 text-brown-muted font-playfair italic">Mempersiapkan data souvenir & hampers...</div>

    return (
        <>
            <style>{`
            .btn-sm-delete {
                font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em;
                padding: 4px 10px; border-radius: 8px; background-color: #fef2f2; color: #ef4444;
                border: 1px solid #fee2e2; transition: all 0.2s; cursor: pointer;
            }
            .btn-sm-delete:hover { background-color: #ef4444; color: white; }
            `}</style>

            <div className="animate-fade-in pb-12">
                {/* Header */}
                <div className="section-header">
                    <div>
                        <h1 className="section-title">Souvenir & Hampers 🎀 <span className="badge-exclusive ml-2">✦ Premium</span></h1>
                        <p className="section-subtitle">Manajemen vendor, stok souvenir, hingga distribusi ke para tamu undangan</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="btn-outline px-6 py-2.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-2" onClick={openAddD}>
                            <span>+</span> Distribusi
                        </button>
                        <button className="btn-rose px-6 py-2.5 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-gold/20 flex items-center gap-2" onClick={openAddVendor}>
                            <span>+</span> Tambah Vendor
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="stat-card hover:shadow-xl transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-rose-gold/10 flex items-center justify-center text-xl mb-4">📦</div>
                        <div className="font-playfair text-2xl font-bold text-brown leading-tight">{totalUnit}</div>
                        <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Total Pesanan (Pcs)</div>
                    </div>
                    <div className="stat-card hover:shadow-xl transition-all border-sage/20 shadow-sm relative overflow-hidden">
                        <div className="w-12 h-12 rounded-2xl bg-sage/10 flex items-center justify-center text-xl mb-4 text-sage">🎁</div>
                        <div className="font-playfair text-2xl font-bold text-sage leading-tight">{totalDistribusi} <span className="text-sm font-sans font-medium text-brown-muted/70">/ {totalUnit}</span></div>
                        <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Telah Dibagikan</div>
                    </div>
                    <div className="stat-card hover:shadow-xl transition-all border-sage/20 shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-sage/10 flex items-center justify-center text-xl mb-4">🏪</div>
                        <div className="font-playfair text-2xl font-bold text-brown leading-tight">{vendors.length}</div>
                        <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Vendor Terdaftar</div>
                    </div>
                    <div className="stat-card hover:shadow-xl transition-all border-rose-gold/20 shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-rose-gold/5 flex items-center justify-center text-xl mb-4">💰</div>
                        <div className="font-playfair text-2xl font-bold text-brown leading-tight">{rp(totalBiaya)}</div>
                        <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Total Biaya Produksi</div>
                    </div>
                </div>

                {/* ── TABEL VENDOR ─────────────────────────────────────────── */}
                <div className="card p-0 overflow-hidden shadow-sm border-ivory/50 mb-10">
                    <div className="p-6 border-b border-border bg-ivory/5 flex items-center justify-between">
                        <div>
                            <h2 className="font-playfair text-xl font-bold text-brown">Daftar Vendor Souvenir</h2>
                            <p className="text-[10px] font-bold text-brown-muted uppercase tracking-widest mt-1 italic">Semua vendor yang terdaftar untuk pernikahanmu</p>
                        </div>
                        <span className="text-[10px] font-bold text-brown-muted uppercase tracking-widest">{vendors.length} Vendor</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table>
                            <thead>
                                <tr>
                                    <th className="th w-12 text-center">#</th>
                                    <th className="th">Nama Vendor</th>
                                    <th className="th">PIC & Kontak</th>
                                    <th className="th">Jenis Souvenir</th>
                                    <th className="th text-center">Qty</th>
                                    <th className="th text-right">Harga Satuan</th>
                                    <th className="th text-right">Total Biaya</th>
                                    <th className="th text-center">Deadline</th>
                                    <th className="th text-center">Status Bayar</th>
                                    <th className="th text-right pr-8">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vendors.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="td text-center py-20">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-16 h-16 bg-ivory rounded-full flex items-center justify-center text-3xl shadow-inner-white">🎀</div>
                                                <div>
                                                    <p className="font-bold text-brown mb-1">Belum ada vendor terdaftar</p>
                                                    <p className="text-xs text-brown-muted italic">Klik "+ Tambah Vendor" untuk mulai</p>
                                                </div>
                                                <button className="btn-rose px-8 py-2 text-xs font-black uppercase tracking-widest mt-2" onClick={openAddVendor}>+ Tambah Vendor Pertama</button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : vendors.map((v, idx) => (
                                    <tr key={v.id} className="tr group transition-all hover:bg-ivory/10">
                                        <td className="td text-center text-[10px] text-brown-muted/60 font-black">{String(idx + 1).padStart(2, '0')}</td>
                                        <td className="td">
                                            <div className="font-bold text-brown group-hover:text-rose-gold transition-colors">{v.nama_vendor}</div>
                                        </td>
                                        <td className="td">
                                            <div className="text-sm font-bold text-brown">{v.pic_nama || '-'}</div>
                                            <div className="text-[10px] text-brown-muted">{v.pic_hp || '-'}</div>
                                        </td>
                                        <td className="td">
                                            <span className="inline-block bg-ivory/50 text-brown px-3 py-1 rounded-xl border border-border text-xs font-bold">
                                                🎁 {v.jenis_souvenir || '-'}
                                            </span>
                                        </td>
                                        <td className="td text-center font-black text-brown">{v.total_dipesan} <span className="text-[9px] text-brown-muted">pcs</span></td>
                                        <td className="td text-right font-bold text-brown">{rp(v.harga_satuan)}</td>
                                        <td className="td text-right font-black text-rose-gold">{rp((v.total_dipesan || 0) * (v.harga_satuan || 0))}</td>
                                        <td className="td text-center text-xs text-brown-muted font-medium">
                                            {v.deadline_ambil ? new Date(v.deadline_ambil).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                        </td>
                                        <td className="td text-center">
                                            <span className={`badge text-[9px] font-black uppercase tracking-widest px-4 py-1.5 shadow-sm ${v.status_bayar === 'Lunas' ? 'badge-green' : v.status_bayar === 'DP 50%' ? 'badge-blue' : 'badge-red'}`}>
                                                {v.status_bayar}
                                            </span>
                                        </td>
                                        <td className="td text-right pr-8">
                                            <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-all">
                                                <button className="btn-sm-edit shadow-sm" onClick={() => openEditVendor(v)}>Edit</button>
                                                <button className="btn-sm-delete shadow-sm" onClick={() => deleteVendor(v.id)}>Hapus</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Checklist - pakai vendor pertama */}
                {firstVendor && (
                    <div className="card shadow-sm border-ivory/50 mb-10">
                        <div className="p-6 border-b border-border bg-ivory/5 flex justify-between items-center">
                            <div>
                                <h3 className="font-playfair text-xl font-bold text-brown">Tugas Persiapan</h3>
                                <p className="text-[10px] font-bold text-brown-muted uppercase tracking-widest mt-1">Checklist kelengkapan souvenir</p>
                            </div>
                            <span className="badge-rose text-[10px] font-black px-3 py-1 shadow-inner-white">{checkDone} / {CHECKLIST_ITEMS.length}</span>
                        </div>
                        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {CHECKLIST_ITEMS.map(item => (
                                <div key={item} className="flex items-center gap-4 group cursor-pointer" onClick={() => toggleChecklist(item, firstVendor.id)}>
                                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${checklist[item] ? 'bg-sage border-sage text-white shadow-sm shadow-sage/30' : 'border-border bg-white group-hover:border-rose-gold/50'}`}>
                                        {checklist[item] && <span className="text-[10px] font-black">✓</span>}
                                    </div>
                                    <span className={`text-sm font-bold transition-all ${checklist[item] ? 'line-through text-brown-muted opacity-50' : 'text-brown group-hover:text-rose-gold'}`}>
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Distribution Table */}
                <div className="card p-0 overflow-hidden shadow-sm border-ivory/50">
                    <div className="p-6 border-b border-border bg-ivory/5 flex items-center justify-between">
                        <div>
                            <h2 className="font-playfair text-xl font-bold text-brown">Target & Realisasi Distribusi</h2>
                            <p className="text-[10px] font-bold text-brown-muted uppercase tracking-widest mt-1 italic">Pantau sebaran souvenir per kategori tamu</p>
                        </div>
                        <span className="text-[10px] font-bold text-brown-muted uppercase tracking-widest">{distribusi.length} Kategori Dipantau</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table>
                            <thead>
                                <tr>
                                    <th className="th w-16 text-center">#</th>
                                    <th className="th">Kategori Penerima</th>
                                    <th className="th text-center">Target Jumlah</th>
                                    <th className="th text-center">Telah Diberikan</th>
                                    <th className="th">Progres Distribusi</th>
                                    <th className="th text-right pr-8">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {distribusi.length === 0 ? (
                                    <tr><td colSpan={6} className="td text-center py-28 text-brown-muted italic font-medium">Belum ada rincian data distribusi souvenir.</td></tr>
                                ) : distribusi.map((d, idx) => {
                                    const pct = d.jumlah > 0 ? Math.min(100, Math.round((d.sudah_distribusi || 0) / d.jumlah * 100)) : 0
                                    return (
                                        <tr key={d.id} className="tr group transition-all hover:bg-ivory/10">
                                            <td className="td text-center text-[10px] text-brown-muted/60 font-black tracking-widest">{String(idx + 1).padStart(2, '0')}</td>
                                            <td className="td">
                                                <div className="font-bold text-brown group-hover:text-rose-gold transition-colors">{d.kategori}</div>
                                                <div className="text-[9px] text-brown-muted italic font-bold uppercase tracking-tighter mt-0.5">Sesi: {(d.kategori || '').includes('Akad') ? 'Akad Nikah' : 'Resepsi'}</div>
                                            </td>
                                            <td className="td text-center font-black text-brown">{d.jumlah} <span className="text-[9px] text-brown-muted ml-0.5 opacity-50">Pcs</span></td>
                                            <td className="td text-center">
                                                <span className="inline-block bg-sage/5 text-sage px-3 py-1.5 rounded-xl border border-sage/10 font-black shadow-sm text-xs">{d.sudah_distribusi || 0}</span>
                                            </td>
                                            <td className="td min-w-[220px]">
                                                <div className="flex items-center gap-4">
                                                    <div className="progress-track flex-1 h-3 bg-ivory shadow-inner rounded-full p-0.5 border border-border/50">
                                                        <div className={`progress-fill h-full rounded-full transition-all duration-1000 relative overflow-hidden ${pct === 100 ? 'bg-sage' : ''}`} style={{ width: `${pct}%` }}>
                                                            <div className="absolute inset-0 bg-white/10 animate-shimmer" />
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-black text-brown-muted w-10 text-right">{pct}%</span>
                                                </div>
                                            </td>
                                            <td className="td text-right pr-8">
                                                <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-all">
                                                    <button className="btn-sm-edit shadow-sm" onClick={() => openEditD(d)}>Edit</button>
                                                    <button className="btn-sm-delete shadow-sm" onClick={() => deleteDistribusi(d.id)}>Hapus</button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── VENDOR MODAL ─────────────────────────────────────────── */}
                {modalV && (
                    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModalV(false)}>
                        <div className="modal-box max-w-lg">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="font-playfair text-2xl font-bold text-brown">{editVId ? 'Edit' : 'Tambah'} Vendor Souvenir</h2>
                                    <p className="text-[10px] font-bold text-brown-muted uppercase tracking-widest mt-1">Detail rincian kontrak & produksi</p>
                                </div>
                                <button onClick={() => setModalV(false)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-ivory text-brown-muted transition-colors border border-transparent hover:border-border">✕</button>
                            </div>

                            <div className="space-y-5">
                                <div className="form-group">
                                    <label className="form-label">Nama Toko / Vendor <span className="text-red-400">*</span></label>
                                    <input className="form-input shadow-inner-white" placeholder="cth: Kado Kita Souvenir" value={formV.nama_vendor || ''} onChange={e => setFormV(p => ({ ...p, nama_vendor: e.target.value }))} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-group">
                                        <label className="form-label">Nama PIC Vendor</label>
                                        <input className="form-input shadow-inner-white" placeholder="cth: Ibu Sari" value={formV.pic_nama || ''} onChange={e => setFormV(p => ({ ...p, pic_nama: e.target.value }))} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">No. WhatsApp PIC</label>
                                        <input className="form-input shadow-inner-white" placeholder="cth: 0812..." value={formV.pic_hp || ''} onChange={e => setFormV(p => ({ ...p, pic_hp: e.target.value }))} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Jenis Souvenir</label>
                                    <input className="form-input shadow-inner-white" placeholder="cth: Diffuser Kayu Premium, Totebag Kanvas..." value={formV.jenis_souvenir || ''} onChange={e => setFormV(p => ({ ...p, jenis_souvenir: e.target.value }))} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-group">
                                        <label className="form-label">Total Unit Dipesan</label>
                                        <input type="number" className="form-input shadow-inner-white" value={formV.total_dipesan || ''} onChange={e => setFormV(p => ({ ...p, total_dipesan: e.target.value }))} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Harga Satuan (Rp)</label>
                                        <input type="number" className="form-input shadow-inner-white" value={formV.harga_satuan || ''} onChange={e => setFormV(p => ({ ...p, harga_satuan: e.target.value }))} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-group">
                                        <label className="form-label">Target Pengambilan</label>
                                        <input type="date" className="form-input shadow-inner-white" value={formV.deadline_ambil || ''} onChange={e => setFormV(p => ({ ...p, deadline_ambil: e.target.value }))} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Status Pembayaran</label>
                                        <select className="form-select shadow-inner-white" value={formV.status_bayar || 'Belum'} onChange={e => setFormV(p => ({ ...p, status_bayar: e.target.value }))}>
                                            <option value="Belum">Belum Bayar</option>
                                            <option value="DP 50%">DP 50%</option>
                                            <option value="Lunas">Lunas</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 justify-end mt-10 pt-8 border-t border-border">
                                <button className="btn-outline px-8 py-3 text-xs font-bold uppercase tracking-widest" onClick={() => setModalV(false)}>Batal</button>
                                <button className="btn-rose px-10 py-3 text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-gold/20" onClick={saveVendor} disabled={saving}>
                                    {saving ? 'Menyimpan...' : (editVId ? 'Simpan Perubahan' : 'Tambah Vendor')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── DISTRIBUSI MODAL ─────────────────────────────────────── */}
                {modalD && (
                    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModalD(false)}>
                        <div className="modal-box max-w-sm">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="font-playfair text-2xl font-bold text-brown">{editDId ? 'Edit' : 'Tambah'} Distribusi</h2>
                                    <p className="text-[10px] font-bold text-brown-muted uppercase tracking-widest mt-1">Manajemen sebaran souvenir</p>
                                </div>
                                <button onClick={() => setModalD(false)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-ivory text-brown-muted transition-colors border border-transparent hover:border-border">✕</button>
                            </div>

                            <div className="space-y-5">
                                <div className="form-group">
                                    <label className="form-label">Kategori Penerima</label>
                                    <select className="form-select shadow-inner-white" value={formD.kategori} onChange={e => setFormD(p => ({ ...p, kategori: e.target.value }))}>
                                        {KATEGORI_PENERIMA.map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="form-group">
                                        <label className="form-label">Target Jumlah</label>
                                        <input type="number" className="form-input shadow-inner-white" value={formD.jumlah} onChange={e => setFormD(p => ({ ...p, jumlah: e.target.value }))} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Telah Diberikan</label>
                                        <input type="number" className="form-input shadow-inner-white border-sage/20" value={formD.sudah_distribusi} onChange={e => setFormD(p => ({ ...p, sudah_distribusi: e.target.value }))} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 justify-end mt-10 pt-8 border-t border-border">
                                <button className="btn-outline px-8 py-3 text-xs font-bold uppercase tracking-widest" onClick={() => setModalD(false)}>Batal</button>
                                <button className="btn-rose px-10 py-3 text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-gold/20" onClick={saveDistribusi} disabled={saving}>
                                    {saving ? 'Menyimpan...' : 'Simpan Data'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}