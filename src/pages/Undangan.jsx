// src/pages/Undangan.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useWedding } from '../hooks/useWedding'
import { confirmDelete } from '../lib/swal'
import toast from 'react-hot-toast'
import { syncService } from '../lib/syncService'

const rp = (n = 0) => 'Rp ' + Number(n).toLocaleString('id-ID')
const EMPTY = { nama_vendor: '', layanan: '', harga: '', status_bayar: 'Belum', status_kerja: 'Belum' }

export default function Undangan() {
    const { wedding } = useWedding()
    const [items, setItems] = useState([])
    const [cetak, setCetak] = useState(0)
    const [digital, setDigital] = useState(0)
    const [terkirim, setTerkirim] = useState(0)
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [form, setForm] = useState(EMPTY)
    const [editId, setEditId] = useState(null)
    const [saving, setSaving] = useState(false)

    useEffect(() => { if (wedding) fetchData() }, [wedding])

    const fetchData = async () => {
        setLoading(true)
        if (wedding.id === 'dummy-wedding-id') {
            setItems([
                { id: 1, nama_vendor: 'Paperly Invitations', layanan: 'Cetak 300 pcs, Emboss Gold, Hardcover', harga: 4500000, status_bayar: 'Lunas', status_kerja: 'Selesai' },
                { id: 2, nama_vendor: 'NikahRapi Digital', layanan: 'Undangan Web Premium + RSVP System', harga: 500000, status_bayar: 'Lunas', status_kerja: 'Live' },
            ])
            setCetak(300)
            setDigital(450)
            setTerkirim(520)
            setLoading(false)
            return
        }
        const [vRes, pRes] = await Promise.all([
            supabase.from('undangan_vendor').select('*').eq('wedding_id', wedding.id).order('created_at'),
            supabase.from('wedding_profiles').select('undangan_cetak,undangan_digital,undangan_terkirim').eq('id', wedding.id).single(),
        ])
        setItems(vRes.data || [])
        if (pRes.data) { setCetak(pRes.data.undangan_cetak || 0); setDigital(pRes.data.undangan_digital || 0); setTerkirim(pRes.data.undangan_terkirim || 0) }
        setLoading(false)
    }

    const saveStats = async () => {
        await supabase.from('wedding_profiles').update({ undangan_cetak: Number(cetak), undangan_digital: Number(digital), undangan_terkirim: Number(terkirim) }).eq('id', wedding.id)
        toast.success('Data disimpan!')
    }

    const openAdd = () => { setForm(EMPTY); setEditId(null); setModal(true) }
    const openEdit = (i) => { setForm({ nama_vendor: i.nama_vendor, layanan: i.layanan || '', harga: i.harga || '', status_bayar: i.status_bayar || 'Belum', status_kerja: i.status_kerja || 'Belum' }); setEditId(i.id); setModal(true) }

    const handleSave = async () => {
        if (!form.nama_vendor) { toast.error('Nama vendor wajib!'); return }
        setSaving(true)
        const payload = { ...form, harga: Number(form.harga) || 0, wedding_id: wedding.id }
        
        try {
            if (editId) { 
                await supabase.from('undangan_vendor').update(payload).eq('id', editId) 
            } else { 
                await supabase.from('undangan_vendor').insert(payload) 
            }

            // --- INVERSE SYNC TO BUDGET ---
            const { data: allItems } = await supabase.from('undangan_vendor').select('harga').eq('wedding_id', wedding.id)
            const newTotal = (allItems || []).reduce((a, i) => a + (i.harga || 0), 0)

            await syncService.syncToBudget(
                wedding.id, 
                'undangan', 
                'Paket Undangan', 
                newTotal, 
                0 // Kita anggap aktual diatur di budget planner
            )

            toast.success('Undangan & budget diperbarui! ✨')
            setModal(false)
            fetchData()
        } catch (error) {
            console.error(error)
            toast.error('Gagal sinkronisasi budget')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        const result = await confirmDelete('Hapus vendor ini?', 'Vendor undangan ini akan dihapus dari daftar.')
        if (!result.isConfirmed) return

        await supabase.from('undangan_vendor').delete().eq('id', id)
        toast.success('Dihapus!')
        fetchData()
    }

    const resetStats = async () => {
        const result = await confirmDelete('Reset distribusi?', 'Semua angka distribusi akan dikembalikan ke 0.')
        if (!result.isConfirmed) return

        setCetak(0); setDigital(0); setTerkirim(0)
        await supabase.from('wedding_profiles').update({ undangan_cetak: 0, undangan_digital: 0, undangan_terkirim: 0 }).eq('id', wedding.id)
        toast.success('Distribusi direset!')
    }

    const total = Number(cetak) + Number(digital)
    const pct = total > 0 ? Math.round(Number(terkirim) / total * 100) : 0
    const badgePay = { Lunas: 'badge-green', 'Belum Lunas': 'badge-yellow', Belum: 'badge-grey' }
    const badgeWork = { Selesai: 'badge-green', 'In Progress': 'badge-yellow', Approved: 'badge-green', Live: 'badge-green', Belum: 'badge-grey' }

    if (loading && items.length === 0) return <div className="text-center py-20 text-brown-muted font-playfair italic">Meyiapkan data undangan pernikahanmu...</div>

    return (
        <div className="animate-fade-in pb-12">
            <div className="section-header">
                <div>
                    <h1 className="section-title">Undangan & Desain 💌</h1>
                    <p className="section-subtitle">Kelola desain, vendor cetak, dan pantau pengiriman undangan</p>
                </div>
                <button className="btn-rose px-8 shadow-lg shadow-rose-gold/20" onClick={openAdd}>+ Tambah Vendor Undangan</button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="stat-card">
                    <div className="w-12 h-12 rounded-2xl bg-rose-gold/10 flex items-center justify-center text-xl mb-4">🖨️</div>
                    <div className="font-playfair text-2xl font-bold text-brown leading-none">{cetak}</div>
                    <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Undangan Cetak</div>
                </div>
                <div className="stat-card border-sage/20">
                    <div className="w-12 h-12 rounded-2xl bg-sage/10 flex items-center justify-center text-xl mb-4">📱</div>
                    <div className="font-playfair text-2xl font-bold text-brown leading-none">{digital}</div>
                    <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Undangan Digital</div>
                </div>
                <div className="stat-card border-rose-gold/20">
                    <div className="w-12 h-12 rounded-2xl bg-dusty-pink/20 flex items-center justify-center text-xl mb-4">📬</div>
                    <div className="font-playfair text-2xl font-bold text-brown leading-none">{terkirim}</div>
                    <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Sudah Terkirim</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
                {/* Update Stats */}
                <div className="card lg:col-span-2 shadow-sm border-ivory/50">
                    <div className="p-6 border-b border-border mb-6 bg-ivory/5">
                        <h2 className="font-playfair text-xl font-bold text-brown">Update Distribusi</h2>
                    </div>
                    <div className="px-8 space-y-5 pb-8">
                        <div className="form-group">
                            <label className="form-label">Total Undangan Cetak (Lembar)</label>
                            <input type="number" className="form-input shadow-inner-white" placeholder="0" value={cetak} onChange={e => setCetak(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Total Undangan Digital / Web</label>
                            <input type="number" className="form-input shadow-inner-white" placeholder="0" value={digital} onChange={e => setDigital(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Sudah Berhasil Terkirim</label>
                            <input type="number" className="form-input shadow-inner-white" placeholder="0" value={terkirim} onChange={e => setTerkirim(e.target.value)} />
                        </div>

                        <div className="pt-6 border-t border-border mt-8">
                            <div className="flex justify-between items-end text-[10px] font-black text-brown mb-3 uppercase tracking-widest">
                                <span>Progres Pengiriman</span>
                                <span className="text-rose-gold">{terkirim} / {total} ({pct}%)</span>
                            </div>
                            <div className="progress-track h-3 mb-8 bg-ivory">
                                <div className="progress-fill shadow-sm relative overflow-hidden" style={{ width: `${pct}%` }}>
                                    <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="btn-outline w-1/3 py-4 text-xs font-black uppercase tracking-widest active:scale-95 transition-all text-danger border-danger hover:bg-danger hover:text-white" onClick={resetStats}>Reset</button>
                                <button className="btn-rose w-2/3 py-4 text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-gold/20 active:scale-95 transition-all" onClick={saveStats}>Simpan Perubahan</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vendor List */}
                <div className="card lg:col-span-3 p-0 overflow-hidden group/table shadow-sm border-ivory/50">
                    <div className="p-6 border-b border-border bg-ivory/10 flex items-center justify-between">
                        <h2 className="font-playfair text-xl font-bold text-brown">Vendor Desain & Cetak</h2>
                        <span className="text-[10px] font-bold text-brown-muted uppercase tracking-widest italic">{items.length} Vendor Terdaftar</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table>
                            <thead>
                                <tr>
                                    <th className="th">Nama Vendor</th>
                                    <th className="th">Layanan</th>
                                    <th className="th">Biaya</th>
                                    <th className="th">Pembayaran</th>
                                    <th className="th">Produksi</th>
                                    <th className="th text-right pr-8">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.length === 0 ? (
                                    <tr><td colSpan={6} className="td text-center py-24 text-brown-muted italic">Belum ada vendor undangan yang ditambahkan.</td></tr>
                                ) : items.map(item => (
                                    <tr key={item.id} className="tr group">
                                        <td className="td">
                                            <div className="font-bold text-brown group-hover:text-rose-gold transition-colors">{item.nama_vendor}</div>
                                        </td>
                                        <td className="td">
                                            <span className="badge-rose text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-tighter opacity-70">{item.layanan || 'Undangan'}</span>
                                        </td>
                                        <td className="td text-xs font-bold text-brown">{rp(item.harga)}</td>
                                        <td className="td">
                                            <span className={`badge ${badgePay[item.status_bayar] || 'badge-grey'} text-[9px] font-black uppercase`}>
                                                {item.status_bayar}
                                            </span>
                                        </td>
                                        <td className="td">
                                            <span className={`badge ${badgeWork[item.status_kerja] || 'badge-grey'} text-[9px] font-black uppercase`}>
                                                {item.status_kerja === 'In Progress' ? 'Diproses' : item.status_kerja}
                                            </span>
                                        </td>
                                        <td className="td text-right pr-8">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                <button className="btn-sm-edit shadow-sm" onClick={() => openEdit(item)}>Edit</button>
                                                <button className="btn-sm-danger p-1 shadow-sm" onClick={() => handleDelete(item.id)}>✕</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {modal && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
                    <div className="modal-box max-w-md">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="font-playfair text-2xl font-bold text-brown">
                                    {editId ? 'Edit' : 'Tambah'} Vendor
                                </h2>
                                <p className="text-[10px] font-bold text-brown-muted uppercase tracking-widest mt-1">Detail pengerjaan undangan</p>
                            </div>
                            <button onClick={() => setModal(false)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-ivory text-brown-muted transition-colors">✕</button>
                        </div>

                        <div className="space-y-5">
                            <div className="form-group">
                                <label className="form-label">Nama Vendor / Percetakan</label>
                                <input className="form-input shadow-inner-white" placeholder="cth: Percetakan Jaya, Digital Invite..." value={form.nama_vendor} onChange={e => setForm(p => ({ ...p, nama_vendor: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Layanan / Spesifikasi</label>
                                <input className="form-input shadow-inner-white" placeholder="cth: Cetak 180 pcs, Foil Emas, Hardcover..." value={form.layanan} onChange={e => setForm(p => ({ ...p, layanan: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Total Biaya Pengerjaan (Rp)</label>
                                <input type="number" className="form-input shadow-inner-white" placeholder="0" value={form.harga} onChange={e => setForm(p => ({ ...p, harga: e.target.value }))} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label">Status Pembayaran</label>
                                    <select className="form-select shadow-inner-white" value={form.status_bayar} onChange={e => setForm(p => ({ ...p, status_bayar: e.target.value }))}>
                                        {['Belum', 'Belum Lunas', 'Lunas'].map(v => <option key={v}>{v}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Status Produksi</label>
                                    <select className="form-select shadow-inner-white" value={form.status_kerja} onChange={e => setForm(p => ({ ...p, status_kerja: e.target.value }))}>
                                        <option value="Belum">Antrian</option>
                                        <option value="In Progress">Proses Desain/Cetak</option>
                                        <option value="Approved">Desain Disetujui</option>
                                        <option value="Selesai">Sudah Selesai</option>
                                        <option value="Live">Sudah Online (Digital)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-end mt-10 pt-8 border-t border-border">
                            <button className="btn-outline px-8 py-3 text-xs font-bold uppercase tracking-widest" onClick={() => setModal(false)}>Batal</button>
                            <button className="btn-rose px-10 py-3 text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-gold/20" onClick={handleSave} disabled={saving}>
                                {saving ? 'Menyimpan...' : 'Simpan Data Vendor'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}