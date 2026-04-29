// src/pages/VendorManager.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useWedding } from '../hooks/useWedding'
import { confirmDelete } from '../lib/swal'
import toast from 'react-hot-toast'

const rp = (n = 0) => 'Rp ' + Number(n).toLocaleString('id-ID')
const KATEGORI = ['Venue', 'Katering', 'Foto/Video', 'Dekorasi', 'MUA', 'Busana', 'Hiburan', 'Lainnya']
const EMPTY = { nama: '', kategori: 'Venue', pic_nama: '', pic_hp: '', total: '', dp: '', deadline_pelunasan: '', status_kontrak: 'Belum TTD', catatan: '' }

export default function VendorManager() {
    const { wedding } = useWedding()
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [form, setForm] = useState(EMPTY)
    const [editId, setEditId] = useState(null)
    const [saving, setSaving] = useState(false)

    useEffect(() => { if (wedding) fetchItems() }, [wedding])

    const fetchItems = async () => {
        setLoading(true)
        const { data } = await supabase.from('vendors').select('*').eq('wedding_id', wedding.id).order('created_at')
        setItems(data || [])
        setLoading(false)
    }

    const openAdd = () => { setForm(EMPTY); setEditId(null); setModal(true) }
    const openEdit = (i) => {
        setForm({ nama: i.nama, kategori: i.kategori, pic_nama: i.pic_nama || '', pic_hp: i.pic_hp || '', total: i.total || '', dp: i.dp || '', deadline_pelunasan: i.deadline_pelunasan || '', status_kontrak: i.status_kontrak || 'Belum TTD', catatan: i.catatan || '' })
        setEditId(i.id); setModal(true)
    }

    // Fungsi helper untuk membersihkan payload dari kolom yang tidak ada di DB
    const getSafePayload = async (tableName, rawPayload) => {
        try {
            const { data, error } = await supabase.from(tableName).select('*').limit(1)
            if (error || data.length === 0) return rawPayload // Jika kosong/error, kirim apa adanya
            
            const dbColumns = Object.keys(data[0])
            const safePayload = {}
            Object.keys(rawPayload).forEach(key => {
                if (dbColumns.includes(key)) {
                    safePayload[key] = rawPayload[key]
                } else {
                    console.warn(`⚠️ Field '${key}' diabaikan karena tidak ada di tabel '${tableName}'`)
                }
            })
            return safePayload
        } catch (e) {
            return rawPayload
        }
    }

    const handleSave = async () => {
        if (!form.nama) {
            toast.error('Nama vendor wajib diisi!')
            return
        }

        if (!wedding?.id) {
            toast.error('Gagal: ID Pernikahan tidak ditemukan. Silakan refresh halaman.')
            return
        }

        setSaving(true)
        console.log("🔍 Memulai proses simpan aman (Dynamic Sync)...")

        // Persiapkan Payload Dasar
        const rawPayload = { 
            ...form, 
            total: Number(form.total) || 0, 
            dp: Number(form.dp) || 0, 
            deadline_pelunasan: form.deadline_pelunasan || null,
            wedding_id: wedding.id 
        }

        try {
            // Filter payload agar hanya mengirim kolom yang BENAR-BENAR ada di DB
            const safePayload = await getSafePayload('vendors', rawPayload)
            console.log("📦 Payload Final (Safe):", safePayload)

            let result
            if (editId) {
                result = await supabase.from('vendors').update(safePayload).eq('id', editId)
            } else {
                result = await supabase.from('vendors').insert(safePayload)
            }

            if (result.error) {
                console.error("❌ Supabase Error:", result.error)
                throw new Error(result.error.message)
            }

            console.log("✅ Data berhasil tersimpan!")
            toast.success(editId ? 'Vendor diperbarui!' : 'Vendor ditambahkan!')
            
            setModal(false)
            fetchItems()
            setSaving(false)
        } catch (err) {
            console.error("💥 Catch Error:", err.message)
            toast.error(`Gagal menyimpan: ${err.message}`)
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        const result = await confirmDelete('Hapus vendor ini?', 'Semua data kontrak vendor ini akan hilang permanen.')
        if (!result.isConfirmed) return

        const { error } = await supabase.from('vendors').delete().eq('id', id)
        if (error) {
            toast.error(`Gagal menghapus: ${error.message}`)
        } else {
            toast.success('Dihapus!')
            fetchItems()
        }
    }

    const totalKontrak = items.reduce((a, i) => a + (i.total || 0), 0)
    const totalDP = items.reduce((a, i) => a + (i.dp || 0), 0)
    const totalSisa = totalKontrak - totalDP

    // Vendor dengan deadline < 30 hari
    const deadlineDekat = items.filter(i => {
        if (!i.deadline_pelunasan) return false
        const diff = Math.ceil((new Date(i.deadline_pelunasan) - new Date()) / 86_400_000)
        return diff <= 30 && diff >= 0
    })

    if (loading && items.length === 0) return <div className="text-center py-20 text-brown-muted font-playfair italic">Menghubungkan dengan daftar vendor kalian...</div>

    return (
        <div className="animate-fade-in pb-12">
            <div className="section-header">
                <div>
                    <h1 className="section-title">Manajemen Vendor 🤝</h1>
                    <p className="section-subtitle">Kelola kontrak, pembayaran, dan kontak penanggung jawab vendor pernikahan</p>
                </div>
                <button className="btn-rose px-8 shadow-lg shadow-rose-gold/20 flex items-center gap-2" onClick={openAdd}>
                    <span>+</span> Tambah Vendor Baru
                </button>
            </div>

            {deadlineDekat.length > 0 && (
                <div className="bg-danger/5 border border-danger/20 text-danger px-8 py-5 rounded-3xl mb-10 flex items-center gap-5 shadow-sm animate-pulse-subtle">
                    <div className="w-12 h-12 rounded-2xl bg-danger/10 flex items-center justify-center text-2xl shadow-inner-white">⚠️</div>
                    <div className="flex-1">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">Peringatan Pelunasan</div>
                        <p className="text-sm font-bold leading-relaxed">
                            Ada {deadlineDekat.length} vendor dengan deadline pelunasan di bawah 30 hari! Segera periksa rincian pembayaran kalian.
                        </p>
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="stat-card hover:shadow-xl transition-all border-ivory/50">
                    <div className="w-12 h-12 rounded-2xl bg-rose-gold/10 flex items-center justify-center text-xl mb-4">📋</div>
                    <div className="font-playfair text-2xl font-bold text-brown leading-tight">{rp(totalKontrak)}</div>
                    <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Total Nilai Kontrak</div>
                </div>
                <div className="stat-card hover:shadow-xl transition-all border-sage/10 shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-sage/10 flex items-center justify-center text-xl mb-4">✅</div>
                    <div className="font-playfair text-2xl font-bold text-brown leading-tight">{rp(totalDP)}</div>
                    <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Total Terbayar (DP/Cicil)</div>
                </div>
                <div className="stat-card hover:shadow-xl transition-all border-danger/5 shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-danger/5 flex items-center justify-center text-xl mb-4">⏳</div>
                    <div className="font-playfair text-2xl font-bold text-brown leading-tight">{rp(totalSisa)}</div>
                    <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Sisa Hutang Pelunasan</div>
                </div>
            </div>

            {/* Table */}
            <div className="card p-0 overflow-hidden group/table shadow-sm border-ivory/50">
                <div className="p-6 border-b border-border bg-ivory/5 flex items-center justify-between">
                    <h2 className="font-playfair text-xl font-bold text-brown">Daftar Rekanan Vendor</h2>
                    <span className="text-[10px] font-bold text-brown-muted uppercase tracking-widest italic">{items.length} Vendor Aktif</span>
                </div>
                <div className="overflow-x-auto">
                    <table>
                        <thead>
                            <tr>
                                <th className="th">Nama Vendor</th>
                                <th className="th">Kategori</th>
                                <th className="th">PIC / Kontak</th>
                                <th className="th">Total Nilai</th>
                                <th className="th">DP/Terbayar</th>
                                <th className="th">Sisa Tagihan</th>
                                <th className="th">Deadline Bayar</th>
                                <th className="th">Kontrak</th>
                                <th className="th text-right pr-8">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr><td colSpan={9} className="td text-center py-24 text-brown-muted italic font-medium">Belum ada vendor terdaftar. Yuk, mulai data rekanan pernikahanmu!</td></tr>
                            ) : items.map(item => {
                                const sisa = (item.total || 0) - (item.dp || 0)
                                const kb = item.status_kontrak === 'Sudah TTD' ? 'badge-green' : 'badge-yellow'
                                let deadlineSisa = null
                                if (item.deadline_pelunasan) {
                                    deadlineSisa = Math.ceil((new Date(item.deadline_pelunasan) - new Date()) / 86_400_000)
                                }
                                return (
                                    <tr key={item.id} className="tr group transition-all hover:bg-ivory/10">
                                        <td className="td font-bold text-brown group-hover:text-rose-gold transition-colors">{item.nama}</td>
                                        <td className="td">
                                            <span className="badge-rose text-[9px] px-3 py-1 font-black uppercase tracking-tighter shadow-sm">{item.kategori}</span>
                                        </td>
                                        <td className="td">
                                            <div className="text-[11px] font-black text-brown uppercase tracking-tighter">{item.pic_nama || '—'}</div>
                                            <div className="text-[10px] text-brown-muted italic font-bold">{item.pic_hp || ''}</div>
                                        </td>
                                        <td className="td text-[11px] font-bold text-brown-muted">{rp(item.total)}</td>
                                        <td className="td text-[11px] font-black text-sage">{rp(item.dp)}</td>
                                        <td className="td text-[11px] font-black text-danger bg-danger/5 px-2 rounded-lg">{rp(sisa)}</td>
                                        <td className="td">
                                            {item.deadline_pelunasan ? (
                                                <div className="space-y-1.5">
                                                    <div className="text-[10px] text-brown font-black uppercase tracking-tighter">{new Date(item.deadline_pelunasan).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                                    {deadlineSisa !== null && (
                                                        <span className={`badge ${deadlineSisa <= 14 ? 'badge-red' : deadlineSisa <= 30 ? 'badge-yellow' : 'badge-green'} text-[8px] font-black uppercase px-2 py-0.5 shadow-sm block w-fit`}>
                                                            {deadlineSisa <= 0 ? 'Hari Ini / Lewat' : `${deadlineSisa} Hari Lagi`}
                                                        </span>
                                                    )}
                                                </div>
                                            ) : <span className="text-brown-muted/30 text-[10px] font-black tracking-widest">TBA</span>}
                                        </td>
                                        <td className="td">
                                            <span className={`badge ${kb} text-[9px] font-black uppercase tracking-tighter px-3`}>
                                                {item.status_kontrak === 'Sudah TTD' ? '✅ TTD' : '⏳ Draft'}
                                            </span>
                                        </td>
                                        <td className="td text-right pr-8">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                <button className="btn-sm-edit shadow-sm" onClick={() => openEdit(item)}>Edit</button>
                                                <button className="btn-sm-danger p-1 shadow-sm" onClick={() => handleDelete(item.id)}>✕</button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {modal && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
                    <div className="modal-box max-w-lg">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="font-playfair text-2xl font-bold text-brown">
                                    {editId ? 'Edit' : 'Tambah'} Vendor
                                </h2>
                                <p className="text-[10px] font-bold text-brown-muted uppercase tracking-widest mt-1">Detail informasi dan kontrak rekanan</p>
                            </div>
                            <button onClick={() => setModal(false)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-ivory text-brown-muted transition-colors">✕</button>
                        </div>
                        
                        <div className="space-y-5">
                            <div className="form-group">
                                <label className="form-label">Nama Perusahaan / Vendor</label>
                                <input className="form-input shadow-inner-white" placeholder="Masukkan nama lengkap vendor..." value={form.nama} onChange={e => setForm(p => ({ ...p, nama: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Kategori Layanan</label>
                                <select className="form-select shadow-inner-white" value={form.kategori} onChange={e => setForm(p => ({ ...p, kategori: e.target.value }))}>
                                    {KATEGORI.map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label">Nama PIC (Kontak)</label>
                                    <input className="form-input shadow-inner-white" placeholder="Nama penanggung jawab..." value={form.pic_nama} onChange={e => setForm(p => ({ ...p, pic_nama: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">No WhatsApp / HP</label>
                                    <input className="form-input shadow-inner-white" placeholder="cth: 0812..." value={form.pic_hp} onChange={e => setForm(p => ({ ...p, pic_hp: e.target.value }))} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label">Total Nilai Kontrak (Rp)</label>
                                    <input type="number" className="form-input shadow-inner-white" placeholder="0" value={form.total} onChange={e => setForm(p => ({ ...p, total: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Total Terbayar (Rp)</label>
                                    <input type="number" className="form-input shadow-inner-white" placeholder="0" value={form.dp} onChange={e => setForm(p => ({ ...p, dp: e.target.value }))} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label">Batas Waktu Pelunasan</label>
                                    <input type="date" className="form-input shadow-inner-white" value={form.deadline_pelunasan} onChange={e => setForm(p => ({ ...p, deadline_pelunasan: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Status Kontrak</label>
                                    <select className="form-select shadow-inner-white" value={form.status_kontrak} onChange={e => setForm(p => ({ ...p, status_kontrak: e.target.value }))}>
                                        <option value="Belum TTD">Belum Tanda Tangan (Draft)</option>
                                        <option value="Sudah TTD">Sudah Tanda Tangan (Final)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Catatan Tambahan (Layanan/Item)</label>
                                <textarea className="form-textarea shadow-inner-white" rows={2} placeholder="Detail item layanan, termin pembayaran, dll..." value={form.catatan} onChange={e => setForm(p => ({ ...p, catatan: e.target.value }))} />
                            </div>
                        </div>

                        <div className="flex gap-4 justify-end mt-10 pt-8 border-t border-border">
                            <button className="btn-outline px-8 py-3 text-xs font-bold uppercase tracking-widest" onClick={() => setModal(false)}>Batal</button>
                            <button className="btn-rose px-10 py-3 text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-gold/20" onClick={handleSave} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan Data Vendor'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}