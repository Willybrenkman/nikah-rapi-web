// src/pages/Checklist.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useWedding } from '../hooks/useWedding'
import { confirmDelete } from '../lib/swal'
import toast from 'react-hot-toast'

const EMPTY = { task: '', kategori: 'Venue', deadline: '', pic: '', priority: 'Medium', status: 'Belum' }
const priorityBadge = { High: 'badge-red', Medium: 'badge-yellow', Low: 'badge-green' }
const statusBadge = { Selesai: 'badge-green', Proses: 'badge-yellow', Belum: 'badge-grey' }

export default function Checklist() {
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
        const { data } = await supabase.from('checklist_items').select('*').eq('wedding_id', wedding.id).order('created_at')
        setItems(data || [])
        setLoading(false)
    }

    const toggleDone = async (item) => {
        const newStatus = item.is_done ? 'Belum' : 'Selesai'
        await supabase.from('checklist_items').update({ is_done: !item.is_done, status: newStatus }).eq('id', item.id)
        fetchItems()
    }

    const openAdd = () => { setForm(EMPTY); setEditId(null); setModal(true) }
    const openEdit = (i) => { setForm({ task: i.task, kategori: i.kategori || 'Venue', deadline: i.deadline || '', pic: i.pic || '', priority: i.priority || 'Medium', status: i.status || 'Belum' }); setEditId(i.id); setModal(true) }

    const handleSave = async () => {
        if (!form.task) { toast.error('Task wajib diisi!'); return }
        setSaving(true)
        const payload = { ...form, is_done: form.status === 'Selesai', wedding_id: wedding.id }
        if (editId) { await supabase.from('checklist_items').update(payload).eq('id', editId); toast.success('Task diperbarui!') }
        else { await supabase.from('checklist_items').insert(payload); toast.success('Task ditambahkan!') }
        setModal(false); fetchItems(); setSaving(false)
    }

    const handleDelete = async (id) => {
        const result = await confirmDelete('Hapus tugas ini?', 'Tugas ini akan hilang dari daftar persiapan pernikahanmu.')
        if (!result.isConfirmed) return
        
        await supabase.from('checklist_items').delete().eq('id', id)
        toast.success('Dihapus!')
        fetchItems()
    }

    const doneCount = items.filter(i => i.is_done).length
    const pct = items.length > 0 ? Math.round(doneCount / items.length * 100) : 0
    const displayed = filter === 'Semua' ? items : filter === 'Prioritas Tinggi' ? items.filter(i => i.priority === 'High') : items.filter(i => i.status === (filter === 'Selesai' ? 'Selesai' : filter === 'Dalam Proses' ? 'Proses' : 'Belum'))

    if (loading && items.length === 0) return <div className="text-center py-20 text-brown-muted font-playfair italic">Meyiapkan daftar tugas persiapan pernikahanmu...</div>

    return (
        <div className="animate-fade-in pb-12">
            <div className="section-header">
                <div>
                    <h1 className="section-title">Checklist Persiapan ✅</h1>
                    <p className="section-subtitle">Daftar tugas terorganisir untuk memastikan hari bahagia kalian berjalan sempurna</p>
                </div>
                <button className="btn-rose px-8 shadow-lg shadow-rose-gold/20 flex items-center gap-2" onClick={openAdd}>
                    <span>+</span> Tambah Tugas Baru
                </button>
            </div>

            {/* Overall progress */}
            <div className="card mb-8 p-6 md:p-10 border-sage/10 bg-gradient-to-br from-white via-white to-sage/5 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <div className="text-[10px] font-black text-brown-muted uppercase tracking-[0.2em] mb-1">Total Progres Persiapan</div>
                        <h2 className="font-playfair text-2xl font-bold text-brown">Langkah Menuju Pelaminan</h2>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-playfair font-black text-sage leading-none">{pct}%</div>
                        <div className="text-[10px] font-bold text-brown-muted uppercase tracking-widest mt-1">{doneCount} dari {items.length} Tugas Selesai</div>
                    </div>
                </div>
                <div className="progress-track h-4 bg-ivory shadow-inner rounded-full overflow-hidden">
                    <div className="progress-fill shadow-sm bg-sage relative overflow-hidden" style={{ width: `${pct}%` }}>
                        <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-4 scrollbar-hide">
                {['Semua', 'Prioritas Tinggi', 'Belum Dimulai', 'Dalam Proses', 'Selesai'].map(f => (
                    <button 
                        key={f} 
                        className={`filter-btn whitespace-nowrap px-6 py-2.5 text-[11px] font-black uppercase tracking-widest ${filter === f ? 'active' : ''}`} 
                        onClick={() => setFilter(f)}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="card p-0 overflow-hidden group/table shadow-sm border-ivory/50">
                <div className="overflow-x-auto">
                    <table>
                        <thead>
                            <tr>
                                <th className="th w-20 text-center">Status</th>
                                <th className="th">Tugas / Aktivitas</th>
                                <th className="th">Kategori</th>
                                <th className="th">Deadline</th>
                                <th className="th">PIC</th>
                                <th className="th">Prioritas</th>
                                <th className="th text-right pr-8">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayed.length === 0 ? (
                                <tr><td colSpan={7} className="td text-center py-24 text-brown-muted italic font-medium">Belum ada tugas dalam kategori ini. Mari mulai buat daftar!</td></tr>
                            ) : displayed.map(item => (
                                <tr key={item.id} className={`tr group transition-all ${item.is_done ? 'bg-ivory/10' : ''}`}>
                                    <td className="td text-center">
                                        <div className="flex justify-center">
                                            <input 
                                                type="checkbox" 
                                                checked={!!item.is_done} 
                                                onChange={() => toggleDone(item)} 
                                                className="w-6 h-6 rounded-lg border-brown-muted/20 text-rose-gold focus:ring-rose-gold/30 cursor-pointer transition-all hover:scale-110 shadow-sm" 
                                            />
                                        </div>
                                    </td>
                                    <td className={`td transition-all duration-500 max-w-xs truncate ${item.is_done ? 'line-through text-brown-muted opacity-40 font-medium' : 'font-bold text-brown group-hover:text-rose-gold'}`}>
                                        {item.task}
                                    </td>
                                    <td className="td">
                                        <span className="badge-rose text-[9px] px-2.5 py-0.5 rounded uppercase font-black tracking-tighter opacity-70">{item.kategori || 'Umum'}</span>
                                    </td>
                                    <td className="td text-[10px] font-bold text-brown-muted italic">{item.deadline ? new Date(item.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '—'}</td>
                                    <td className="td text-[10px] font-black text-brown/60 uppercase tracking-tighter">{item.pic || 'TBA'}</td>
                                    <td className="td">
                                        <span className={`badge ${priorityBadge[item.priority] || 'badge-grey'} text-[9px] font-black uppercase tracking-tighter`}>
                                            {item.priority === 'High' ? 'Tinggi' : item.priority === 'Medium' ? 'Sedang' : 'Rendah'}
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
                    <div className="modal-box max-w-md">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="font-playfair text-2xl font-bold text-brown">
                                    {editId ? 'Edit' : 'Tambah'} Tugas
                                </h2>
                                <p className="text-[10px] font-bold text-brown-muted uppercase tracking-widest mt-1">Detail agenda persiapan pernikahan</p>
                            </div>
                            <button onClick={() => setModal(false)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-ivory text-brown-muted transition-colors">✕</button>
                        </div>
                        
                        <div className="space-y-5">
                            <div className="form-group">
                                <label className="form-label">Deskripsi Tugas / Aktivitas</label>
                                <input className="form-input shadow-inner-white" placeholder="cth: DP Katering, Fitting Baju, List Lagu..." value={form.task} onChange={e => setForm(p => ({ ...p, task: e.target.value }))} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label">Kategori</label>
                                    <input className="form-input shadow-inner-white" placeholder="Venue, Katering, MUA..." value={form.kategori} onChange={e => setForm(p => ({ ...p, kategori: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Penanggung Jawab (PIC)</label>
                                    <input className="form-input shadow-inner-white" placeholder="Nama..." value={form.pic} onChange={e => setForm(p => ({ ...p, pic: e.target.value }))} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Tenggat Waktu (Deadline)</label>
                                <input type="date" className="form-input shadow-inner-white" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label">Skala Prioritas</label>
                                    <select className="form-select shadow-inner-white" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
                                        <option value="High">Tinggi (Penting & Mendesak)</option>
                                        <option value="Medium">Sedang (Penting)</option>
                                        <option value="Low">Rendah (Opsional)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Status Saat Ini</label>
                                    <select className="form-select shadow-inner-white" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                                        <option value="Belum">Belum Dimulai</option>
                                        <option value="Proses">Dalam Proses</option>
                                        <option value="Selesai">Selesai</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-end mt-10 pt-8 border-t border-border">
                            <button className="btn-outline px-8 py-3 text-xs font-bold uppercase tracking-widest" onClick={() => setModal(false)}>Batal</button>
                            <button className="btn-rose px-10 py-3 text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-gold/20" onClick={handleSave} disabled={saving}>
                                {saving ? 'Menyimpan...' : 'Simpan Tugas'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}