// src/pages/GuestList.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useWedding } from '../hooks/useWedding'
import { confirmDelete } from '../lib/swal'
import toast from 'react-hot-toast'

const EMPTY = { nama: '', hubungan: 'Keluarga', no_hp: '', asal_kota: '', jumlah_orang: 1, no_meja: '', catatan: '' }
const hubBadge = { VIP: 'badge-rose', Keluarga: 'badge-yellow', Teman: 'badge-blue', Kolega: 'badge-grey' }

export default function GuestList() {
    const { wedding } = useWedding()
    const [items, setItems] = useState([])
    const [filter, setFilter] = useState('Semua')
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [form, setForm] = useState(EMPTY)
    const [editId, setEditId] = useState(null)
    const [saving, setSaving] = useState(false)

    useEffect(() => { if (wedding) fetchItems() }, [wedding])

    const fetchItems = async () => {
        setLoading(true)
        const { data } = await supabase.from('tamu_undangan').select('*').eq('wedding_id', wedding.id).order('created_at')
        setItems(data || [])
        setLoading(false)
    }

    const openAdd = () => { setForm(EMPTY); setEditId(null); setModal(true) }
    const openEdit = (i) => { setForm({ nama: i.nama, hubungan: i.hubungan, no_hp: i.no_hp || '', asal_kota: i.asal_kota || '', jumlah_orang: i.jumlah_orang || 1, no_meja: i.no_meja || '', catatan: i.catatan || '' }); setEditId(i.id); setModal(true) }

    const handleSave = async () => {
        if (!form.nama) { toast.error('Nama tamu wajib diisi!'); return }
        setSaving(true)
        const payload = { ...form, jumlah_orang: Number(form.jumlah_orang) || 1, wedding_id: wedding.id }
        if (editId) { await supabase.from('tamu_undangan').update(payload).eq('id', editId); toast.success('Tamu diperbarui!') }
        else { await supabase.from('tamu_undangan').insert(payload); toast.success('Tamu ditambahkan!') }
        setModal(false); fetchItems(); setSaving(false)
    }

    const handleDelete = async (id) => {
        if (!confirm('Hapus tamu ini?')) return
        await supabase.from('tamu_undangan').delete().eq('id', id)
        toast.success('Dihapus!'); fetchItems()
    }

    const totalOrang = items.reduce((a, i) => a + (i.jumlah_orang || 1), 0)
    const vipCount = items.filter(i => i.hubungan === 'VIP').length

    const filtered = items
        .filter(i => filter === 'Semua' || i.hubungan === filter)
        .filter(i => !search || i.nama.toLowerCase().includes(search.toLowerCase()))

    if (loading && items.length === 0) return <div className="text-center py-20 text-brown-muted font-playfair italic">Menyiapkan daftar tamu undangan kalian...</div>

    return (
        <div className="animate-fade-in pb-12">
            <div className="section-header">
                <div>
                    <h1 className="section-title">Daftar Tamu 👥</h1>
                    <p className="section-subtitle">Manajemen lengkap tamu undangan, kategori, dan penempatan meja</p>
                </div>
                <button className="btn-rose px-8 shadow-lg shadow-rose-gold/20 flex items-center gap-2" onClick={openAdd}>
                    <span>+</span> Tambah Tamu Baru
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="stat-card hover:shadow-xl transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-rose-gold/10 flex items-center justify-center text-xl mb-4">📋</div>
                    <div className="font-playfair text-2xl font-bold text-brown leading-tight">{items.length}</div>
                    <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Total Undangan</div>
                </div>
                <div className="stat-card hover:shadow-xl transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-sage/10 flex items-center justify-center text-xl mb-4">👥</div>
                    <div className="font-playfair text-2xl font-bold text-brown leading-tight">{totalOrang}</div>
                    <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Estimasi Pax</div>
                </div>
                <div className="stat-card hover:shadow-xl transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-dusty-pink/20 flex items-center justify-center text-xl mb-4">⭐</div>
                    <div className="font-playfair text-2xl font-bold text-brown leading-tight">{vipCount}</div>
                    <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Tamu VIP</div>
                </div>
            </div>

            {/* Filter + Search */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                <div className="flex gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
                    {['Semua', 'Keluarga', 'Teman', 'Kolega', 'VIP'].map(f => (
                        <button 
                            key={f} 
                            className={`filter-btn whitespace-nowrap px-6 py-2.5 text-[11px] font-black uppercase tracking-widest ${filter === f ? 'active' : ''}`} 
                            onClick={() => setFilter(f)}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <div className="relative group w-full lg:w-80">
                    <input 
                        className="form-input pl-12 pr-4 py-3 shadow-inner-white focus:ring-rose-gold/20 group-hover:border-rose-gold/50 transition-all text-sm" 
                        placeholder="Cari nama tamu..." 
                        value={search} 
                        onChange={e => setSearch(e.target.value)} 
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-muted/50 group-hover:text-rose-gold transition-colors">🔍</span>
                </div>
            </div>

            {/* Table */}
            <div className="card p-0 overflow-hidden group/table shadow-sm border-ivory/50">
                <div className="p-6 border-b border-border bg-ivory/5 flex items-center justify-between">
                    <h2 className="font-playfair text-xl font-bold text-brown">Rincian Data Tamu</h2>
                    <span className="text-[10px] font-bold text-brown-muted uppercase tracking-widest italic">{filtered.length} Tamu Ditampilkan</span>
                </div>
                <div className="overflow-x-auto">
                    <table>
                        <thead>
                            <tr>
                                <th className="th w-16 text-center">No</th>
                                <th className="th">Nama Lengkap</th>
                                <th className="th">Kategori</th>
                                <th className="th">WhatsApp / HP</th>
                                <th className="th">Asal Kota</th>
                                <th className="th text-center">Pax</th>
                                <th className="th">No Meja</th>
                                <th className="th text-right pr-8">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="td text-center py-24 text-brown-muted italic font-medium">
                                        {search ? 'Tidak ada tamu yang cocok dengan pencarian.' : 'Belum ada tamu undangan. Mulai tambahkan tamu pertama kalian!'}
                                    </td>
                                </tr>
                            ) : filtered.map((item, i) => (
                                <tr key={item.id} className="tr group transition-all hover:bg-ivory/10">
                                    <td className="td text-center text-[10px] text-brown-muted font-black tracking-widest">{String(i + 1).padStart(2, '0')}</td>
                                    <td className="td font-bold text-brown group-hover:text-rose-gold transition-colors">{item.nama}</td>
                                    <td className="td">
                                        <span className={`badge ${hubBadge[item.hubungan] || 'badge-grey'} text-[9px] font-black uppercase tracking-tighter`}>
                                            {item.hubungan === 'VIP' ? '⭐⭐⭐ VIP' : item.hubungan}
                                        </span>
                                    </td>
                                    <td className="td text-[11px] font-medium text-brown-muted">{item.no_hp || '—'}</td>
                                    <td className="td text-[11px] font-bold text-brown/70 italic uppercase tracking-tighter">{item.asal_kota || '—'}</td>
                                    <td className="td text-center">
                                        <span className="badge-sage text-[10px] font-black min-w-[28px] py-1 inline-block shadow-sm">{item.jumlah_orang || 1} Pax</span>
                                    </td>
                                    <td className="td">
                                        {item.no_meja ? (
                                            <span className="font-black text-brown text-[10px] bg-ivory border border-border/50 px-3 py-1 rounded-lg shadow-inner-white">MEJA {item.no_meja}</span>
                                        ) : (
                                            <span className="text-brown-muted/30 text-[10px] font-black tracking-widest">TBA</span>
                                        )}
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
                    <div className="modal-box max-w-md">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="font-playfair text-2xl font-bold text-brown">
                                    {editId ? 'Edit' : 'Tambah'} Tamu
                                </h2>
                                <p className="text-[10px] font-bold text-brown-muted uppercase tracking-widest mt-1">Informasi detail tamu undangan</p>
                            </div>
                            <button onClick={() => setModal(false)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-ivory text-brown-muted transition-colors">✕</button>
                        </div>
                        
                        <div className="space-y-5">
                            <div className="form-group">
                                <label className="form-label">Nama Lengkap Tamu</label>
                                <input className="form-input shadow-inner-white" placeholder="Masukkan nama lengkap tamu..." value={form.nama} onChange={e => setForm(p => ({ ...p, nama: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Kategori / Hubungan</label>
                                <select className="form-select shadow-inner-white" value={form.hubungan} onChange={e => setForm(p => ({ ...p, hubungan: e.target.value }))}>
                                    <option value="Keluarga">Keluarga</option>
                                    <option value="Teman">Teman / Sahabat</option>
                                    <option value="Kolega">Kolega / Rekanan</option>
                                    <option value="VIP">⭐⭐⭐ Tamu VIP</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label">No WhatsApp / HP</label>
                                    <input className="form-input shadow-inner-white" placeholder="cth: 0812..." value={form.no_hp} onChange={e => setForm(p => ({ ...p, no_hp: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Asal Kota</label>
                                    <input className="form-input shadow-inner-white" placeholder="Nama kota..." value={form.asal_kota} onChange={e => setForm(p => ({ ...p, asal_kota: e.target.value }))} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label">Jumlah Orang (Pax)</label>
                                    <input type="number" className="form-input shadow-inner-white" min={1} value={form.jumlah_orang} onChange={e => setForm(p => ({ ...p, jumlah_orang: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Penempatan Meja</label>
                                    <input className="form-input shadow-inner-white" placeholder="cth: A1, VIP-01..." value={form.no_meja} onChange={e => setForm(p => ({ ...p, no_meja: e.target.value }))} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Catatan Khusus (Internal)</label>
                                <textarea className="form-textarea shadow-inner-white" rows={2} placeholder="Alergi makanan, kebutuhan khusus, dll..." value={form.catatan} onChange={e => setForm(p => ({ ...p, catatan: e.target.value }))} />
                            </div>
                        </div>

                        <div className="flex gap-4 justify-end mt-10 pt-8 border-t border-border">
                            <button className="btn-outline px-8 py-3 text-xs font-bold uppercase tracking-widest" onClick={() => setModal(false)}>Batal</button>
                            <button className="btn-rose px-10 py-3 text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-gold/20" onClick={handleSave} disabled={saving}>
                                {saving ? 'Menyimpan...' : 'Simpan Data Tamu'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}