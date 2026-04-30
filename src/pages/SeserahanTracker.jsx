// src/pages/SeserahanTracker.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useWedding } from '../hooks/useWedding'
import toast from 'react-hot-toast'
import { syncService } from '../lib/syncService'
import { exportService } from '../lib/exportService'
import { confirmDelete } from '../lib/swal'

const rp = (n = 0) => 'Rp ' + Number(n).toLocaleString('id-ID')
const KATEGORI = ['Fashion', 'Kecantikan', 'Perhiasan', 'Elektronik', 'Makanan', 'Ibadah', 'Mahar', 'Lainnya']
const STATUS = ['Belum Beli', 'Sudah Beli', 'Sudah Kemas']
const EMPTY = { nama: '', kategori: 'Fashion', estimasi: '', aktual: '', tempat_beli: '', status: 'Belum Beli', catatan: '' }
const badgeMap = { 'Sudah Kemas': 'badge-green', 'Sudah Beli': 'badge-blue', 'Belum Beli': 'badge-red' }

export default function SeserahanTracker() {
    const { wedding } = useWedding()
    const [items, setItems] = useState([])
    const [filter, setFilter] = useState('Semua')
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [form, setForm] = useState(EMPTY)
    const [editId, setEditId] = useState(null)
    const [saving, setSaving] = useState(false)

    useEffect(() => { if (wedding) fetchItems() }, [wedding])

    const fetchItems = async () => {
        setLoading(true)
        if (wedding.id === 'dummy-wedding-id') {
            setItems([
                { id: 1, nama: 'Set Makeup Premium', kategori: 'Kecantikan', estimasi: 2500000, aktual: 2450000, tempat_beli: 'Sephora', status: 'Sudah Beli', catatan: 'Lengkap dengan pouch' },
                { id: 2, nama: 'Sepatu Kerja Pria', kategori: 'Fashion', estimasi: 1200000, aktual: 0, tempat_beli: 'Zalora', status: 'Belum Beli', catatan: 'Ukuran 42' },
                { id: 3, nama: 'Perhiasan Emas', kategori: 'Perhiasan', estimasi: 15000000, aktual: 15000000, tempat_beli: 'Toko Emas', status: 'Sudah Kemas', catatan: 'Mahar utama' },
            ])
            setLoading(false)
            return
        }
        const { data } = await supabase.from('seserahan_items').select('*').eq('wedding_id', wedding.id).order('created_at')
        setItems(data || [])
        setLoading(false)
    }

    const openAdd = () => { setForm(EMPTY); setEditId(null); setModal(true) }
    const openEdit = (i) => {
        setForm({ nama: i.nama, kategori: i.kategori, estimasi: i.estimasi || '', aktual: i.aktual || '', tempat_beli: i.tempat_beli || '', status: i.status, catatan: i.catatan || '' })
        setEditId(i.id); setModal(true)
    }

    const handleSave = async () => {
        if (!form.nama) { toast.error('Nama item wajib diisi!'); return }
        setSaving(true)
        const payload = { nama: form.nama, kategori: form.kategori, estimasi: Number(form.estimasi) || 0, aktual: Number(form.aktual) || 0, tempat_beli: form.tempat_beli, status: form.status, catatan: form.catatan, wedding_id: wedding.id }

        try {
            if (editId) {
                await supabase.from('seserahan_items').update(payload).eq('id', editId)
            } else {
                await supabase.from('seserahan_items').insert(payload)
            }

            // --- INVERSE SYNC TO BUDGET ---
            const { data: allItems } = await supabase.from('seserahan_items').select('estimasi, aktual').eq('wedding_id', wedding.id)
            const newTotalEst = (allItems || []).reduce((a, i) => a + (i.estimasi || 0), 0)
            const newTotalAkt = (allItems || []).reduce((a, i) => a + (i.aktual || 0), 0)

            await syncService.syncToBudget(
                wedding.id,
                'hantaran',
                'Hantaran & Seserahan',
                newTotalEst,
                newTotalAkt
            )

            toast.success('Seserahan & budget diperbarui! ✨')
            setModal(false)
            fetchItems()
        } catch (error) {
            console.error(error)
            toast.error('Gagal sinkronisasi budget')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        const result = await confirmDelete('Hapus item ini?', 'Data seserahan ini tidak bisa dikembalikan.')
        if (!result.isConfirmed) return
        
        await supabase.from('seserahan_items').delete().eq('id', id)
        toast.success('Dihapus!'); fetchItems()
    }

    const displayed = filter === 'Semua' ? items : items.filter(i => i.status === filter)
    const sudahKemas = items.filter(i => i.status === 'Sudah Kemas').length
    const totalEst = items.reduce((a, i) => a + (i.estimasi || 0), 0)
    const pct = items.length > 0 ? Math.round(sudahKemas / items.length * 100) : 0

    const getCatIcon = (cat) => {
        const c = cat.toLowerCase()
        if (c.includes('fashion')) return '👕'
        if (c.includes('kecantikan') || c.includes('makeup')) return '💄'
        if (c.includes('perhiasan') || c.includes('cincin')) return '💍'
        if (c.includes('elektronik') || c.includes('gadget')) return '💻'
        if (c.includes('makan')) return '🍰'
        if (c.includes('ibadah')) return '🕋'
        if (c.includes('mahar')) return '💵'
        return '📦'
    }

    if (loading && items.length === 0) return <div className="text-center py-20 text-brown-muted font-playfair italic">Mendata hantaran seserahan kalian...</div>

    return (
        <div className="animate-fade-in pb-12">
            {/* Header */}
            <div className="section-header">
                <div>
                    <h1 className="section-title">Pelacak Seserahan 🎁 <span className="badge-exclusive ml-2">✦ Premium</span></h1>
                    <p className="section-subtitle">Daftar hantaran, progres pembelian, hingga pengemasan seserahan pernikahan</p>
                </div>
                <div className="flex gap-2">
                    {items.length > 0 && (
                        <button className="btn-outline px-4 flex items-center gap-2 text-sm" onClick={() => exportService.exportSeserahan(items)}>
                            📥 Excel
                        </button>
                    )}
                    <button className="btn-rose px-8 shadow-lg shadow-rose-gold/20 flex items-center gap-2" onClick={openAdd}>
                        <span>+</span> Tambah Item Seserahan
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="stat-card hover:shadow-xl transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-rose-gold/10 flex items-center justify-center text-xl mb-4">🎁</div>
                    <div className="font-playfair text-2xl font-bold text-brown leading-tight">{items.length}</div>
                    <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Total Hantaran</div>
                </div>
                <div className="stat-card hover:shadow-xl transition-all border-rose-gold/20">
                    <div className="w-12 h-12 rounded-2xl bg-rose-gold/5 flex items-center justify-center text-xl mb-4">💰</div>
                    <div className="font-playfair text-2xl font-bold text-brown leading-tight">{rp(totalEst)}</div>
                    <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Estimasi Biaya</div>
                </div>
                <div className="stat-card hover:shadow-xl transition-all border-sage/20">
                    <div className="w-12 h-12 rounded-2xl bg-sage/10 flex items-center justify-center text-xl mb-4">🎀</div>
                    <div className="font-playfair text-2xl font-bold text-brown leading-tight">{sudahKemas}</div>
                    <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Siap / Dikemas</div>
                </div>
                <div className="stat-card hover:shadow-xl transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-ivory flex items-center justify-center text-xl mb-4">⏳</div>
                    <div className="font-playfair text-2xl font-bold text-brown leading-tight">{items.length - sudahKemas}</div>
                    <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Belum Selesai</div>
                </div>
            </div>

            {/* Progress */}
            <div className="card mb-10 p-6 md:p-10 border-rose-gold/10 bg-gradient-to-br from-white via-white to-ivory/30 shadow-sm overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] scale-[4] pointer-events-none transition-transform group-hover:scale-[4.5] duration-1000">🎁</div>
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
                        <div>
                            <h3 className="font-playfair text-xl font-bold text-brown">Progres Persiapan Hantaran</h3>
                            <p className="text-[10px] font-bold text-brown-muted uppercase tracking-widest mt-1 italic">Status Pengemasan & Kelengkapan Item</p>
                        </div>
                        <div className="md:text-right">
                            <span className="font-playfair text-4xl font-black text-rose-gold leading-none">{pct}%</span>
                            <p className="text-[10px] font-bold text-brown-muted uppercase tracking-widest mt-1">{sudahKemas} dari {items.length} Item Selesai</p>
                        </div>
                    </div>
                    <div className="progress-track h-5 bg-ivory shadow-inner rounded-full p-1 border border-border/50">
                        <div className="progress-fill shadow-lg relative overflow-hidden h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${pct}%` }}>
                            <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-4 scrollbar-hide">
                {['Semua', ...STATUS].map(f => (
                    <button
                        key={f}
                        className={`filter-btn whitespace-nowrap px-8 py-3 text-[10px] uppercase font-black tracking-widest transition-all ${filter === f ? 'active ring-4 ring-rose-gold/5 shadow-md shadow-rose-gold/10' : 'bg-white text-brown-muted hover:bg-ivory/50 border border-ivory/50 shadow-sm'}`}
                        onClick={() => setFilter(f)}
                    >
                        {f === 'Sudah Kemas' ? 'Siap Hantar' : f === 'Sudah Beli' ? 'Telah Dibeli' : f === 'Belum Beli' ? 'Perlu Dibeli' : 'Semua Status'}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="card p-0 overflow-hidden group/table shadow-sm border-ivory/50">
                <div className="p-6 border-b border-border bg-ivory/5 flex items-center justify-between">
                    <h2 className="font-playfair text-xl font-bold text-brown">Rincian Barang Seserahan</h2>
                    <span className="text-[10px] font-bold text-brown-muted uppercase tracking-widest italic">{displayed.length} Item Ditampilkan</span>
                </div>
                <div className="overflow-x-auto">
                    <table>
                        <thead>
                            <tr>
                                <th className="th w-16 text-center">No</th>
                                <th className="th">Nama Item / Barang</th>
                                <th className="th">Kategori</th>
                                <th className="th">Estimasi Harga</th>
                                <th className="th">Harga Aktual</th>
                                <th className="th">Tempat Beli</th>
                                <th className="th">Status</th>
                                <th className="th text-right pr-8">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayed.length === 0 ? (
                                <tr><td colSpan={8} className="td text-center py-32 text-brown-muted italic font-medium">Belum ada item hantaran di kategori ini. Yuk, mulai data persiapan seserahanmu!</td></tr>
                            ) : displayed.map((item, i) => (
                                <tr key={item.id} className="tr group transition-all hover:bg-ivory/10">
                                    <td className="td text-center text-[10px] text-brown-muted/60 font-black tracking-widest">{String(i + 1).padStart(2, '0')}</td>
                                    <td className="td">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-ivory flex items-center justify-center text-xl shadow-inner-white border border-ivory/50 group-hover:bg-rose-gold/10 group-hover:scale-110 transition-all duration-500">
                                                {getCatIcon(item.kategori)}
                                            </div>
                                            <span className="font-bold text-brown group-hover:text-rose-gold transition-colors">{item.nama}</span>
                                        </div>
                                    </td>
                                    <td className="td">
                                        <span className="badge-rose text-[9px] px-3 py-1 uppercase font-black tracking-tighter shadow-sm opacity-90">
                                            {item.kategori}
                                        </span>
                                    </td>
                                    <td className="td text-[10px] font-bold text-brown-muted italic">{rp(item.estimasi)}</td>
                                    <td className="td">
                                        {item.aktual ? (
                                            <span className="inline-block text-[11px] font-black text-brown bg-sage/5 px-3 py-1.5 rounded-xl border border-sage/10 shadow-sm">{rp(item.aktual)}</span>
                                        ) : (
                                            <span className="text-[9px] text-brown-muted/40 font-black uppercase tracking-[0.15em] italic">Menunggu...</span>
                                        )}
                                    </td>
                                    <td className="td">
                                        <div className="flex items-center gap-2 text-[10px] font-bold italic text-brown-muted uppercase tracking-tighter">
                                            {item.tempat_beli ? (
                                                <>
                                                    <span className="w-1.5 h-1.5 bg-rose-gold/40 rounded-full shadow-sm" />
                                                    {item.tempat_beli}
                                                </>
                                            ) : <span className="opacity-30 tracking-widest">—</span>}
                                        </div>
                                    </td>
                                    <td className="td">
                                        <span className={`badge ${badgeMap[item.status] || 'badge-grey'} text-[9px] font-black uppercase tracking-tighter px-4 py-1.5 shadow-sm`}>
                                            {item.status === 'Sudah Kemas' ? '✨ Siap' : item.status === 'Sudah Beli' ? '🛒 Dibeli' : '📦 Belum'}
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

            {/* Modal */}
            {modal && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
                    <div className="modal-box max-w-lg">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="font-playfair text-2xl font-bold text-brown">
                                    {editId ? 'Edit' : 'Tambah'} Hantaran
                                </h2>
                                <p className="text-[10px] font-bold text-brown-muted uppercase tracking-widest mt-1">Detail rincian barang seserahan</p>
                            </div>
                            <button onClick={() => setModal(false)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-ivory text-brown-muted transition-colors border border-transparent hover:border-border">✕</button>
                        </div>

                        <div className="space-y-5">
                            <div className="form-group">
                                <label className="form-label">Nama Barang / Item</label>
                                <input className="form-input shadow-inner-white" placeholder="cth: Set Makeup Premium, Sepatu Kerja, Perhiasan..." value={form.nama} onChange={e => setForm(p => ({ ...p, nama: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Kategori Seserahan</label>
                                <select className="form-select shadow-inner-white" value={form.kategori} onChange={e => setForm(p => ({ ...p, kategori: e.target.value }))}>
                                    {KATEGORI.map(k => <option key={k} value={k}>{k}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div className="form-group">
                                    <label className="form-label">Estimasi Harga (Rp)</label>
                                    <input type="number" className="form-input shadow-inner-white" placeholder="0" value={form.estimasi} onChange={e => setForm(p => ({ ...p, estimasi: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Harga Aktual (Rp)</label>
                                    <input type="number" className="form-input shadow-inner-white border-sage/20" placeholder="0" value={form.aktual} onChange={e => setForm(p => ({ ...p, aktual: e.target.value }))} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Lokasi / Toko Pembelian</label>
                                <input className="form-input shadow-inner-white" placeholder="cth: Mall Central, Toko Emas Sejahtera, Shopee..." value={form.tempat_beli} onChange={e => setForm(p => ({ ...p, tempat_beli: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Status Persiapan</label>
                                <select className="form-select shadow-inner-white" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                                    <option value="Belum Beli">Perlu Dibeli</option>
                                    <option value="Sudah Beli">Telah Dibeli</option>
                                    <option value="Sudah Kemas">Siap Hantar / Telah Dikemas</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Catatan Khusus (Internal)</label>
                                <textarea className="form-textarea min-h-[100px] shadow-inner-white" placeholder="Tuliskan detail seperti ukuran, kode warna, atau instruksi pengemasan khusus..." value={form.catatan} onChange={e => setForm(p => ({ ...p, catatan: e.target.value }))} />
                            </div>
                        </div>

                        <div className="flex gap-4 justify-end mt-10 pt-8 border-t border-border">
                            <button className="btn-outline px-8 py-3 text-xs font-bold uppercase tracking-widest" onClick={() => setModal(false)}>Batal</button>
                            <button className="btn-rose px-10 py-3 text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-gold/20" onClick={handleSave} disabled={saving}>
                                {saving ? 'Menyimpan...' : 'Simpan Data Hantaran'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}