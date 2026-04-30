// src/pages/TimelineAcara.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useWedding } from '../hooks/useWedding'
import { confirmDelete } from '../lib/swal'
import toast from 'react-hot-toast'

const SESI = ['H-1', 'Hari-H Akad', 'Hari-H Resepsi']
const STATUS = ['Belum', 'Berlangsung', 'Selesai']
const statusBadge = { Selesai: 'badge-green', Berlangsung: 'badge-yellow', Belum: 'badge-grey' }
const EMPTY = { sesi: 'Hari-H Akad', waktu: '', durasi_menit: '', event: '', lokasi: '', status: 'Belum' }

export default function TimelineAcara() {
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
                { id: 1, sesi: 'Hari-H Akad', waktu: '08:00', durasi_menit: 60, event: 'Prosesi Akad Nikah', lokasi: 'Masjid Jami Luxury', status: 'Selesai' },
                { id: 2, sesi: 'Hari-H Akad', waktu: '09:30', durasi_menit: 30, event: 'Foto Bersama Keluarga', lokasi: 'Masjid Jami Luxury', status: 'Selesai' },
                { id: 3, sesi: 'Hari-H Resepsi', waktu: '11:00', durasi_menit: 30, event: 'Grand Entrance & Opening', lokasi: 'Grand Ballroom Hotel', status: 'Berlangsung' },
                { id: 4, sesi: 'Hari-H Resepsi', waktu: '11:30', durasi_menit: 120, event: 'Ramah Tamah & Makan Siang', lokasi: 'Grand Ballroom Hotel', status: 'Belum' },
                { id: 5, sesi: 'H-1', waktu: '15:00', durasi_menit: 120, event: 'Gladi Resik & Cek Venue', lokasi: 'Grand Ballroom Hotel', status: 'Selesai' },
            ])
            setLoading(false)
            return
        }
        const { data } = await supabase.from('timeline_events').select('*').eq('wedding_id', wedding.id).order('waktu')
        setItems(data || [])
        setLoading(false)
    }

    const openAdd = () => { setForm(EMPTY); setEditId(null); setModal(true) }
    const openEdit = (i) => { setForm({ sesi: i.sesi, waktu: i.waktu || '', durasi_menit: i.durasi_menit || '', event: i.event, lokasi: i.lokasi || '', status: i.status || 'Belum' }); setEditId(i.id); setModal(true) }

    const handleSave = async () => {
        if (!form.event) { toast.error('Nama event wajib diisi!'); return }
        setSaving(true)
        const payload = { ...form, durasi_menit: Number(form.durasi_menit) || 0, wedding_id: wedding.id }
        if (editId) { await supabase.from('timeline_events').update(payload).eq('id', editId); toast.success('Event diperbarui!') }
        else { await supabase.from('timeline_events').insert(payload); toast.success('Event ditambahkan!') }
        setModal(false); fetchItems(); setSaving(false)
    }

    const handleDelete = async (id) => {
        const result = await confirmDelete('Hapus event ini?', 'Aktivitas timeline ini akan dihapus permanen.')
        if (!result.isConfirmed) return
        await supabase.from('timeline_events').delete().eq('id', id)
        toast.success('Dihapus!'); fetchItems()
    }

    const displayed = filter === 'Semua' ? items : items.filter(i => i.sesi === filter)
    const sesiGroups = SESI.filter(s => displayed.some(i => i.sesi === s))

    return (
        <div className="animate-fade-in pb-12">
            <div className="section-header">
                <div>
                    <h1 className="section-title">Timeline Acara 📅</h1>
                    <p className="section-subtitle">Rundown detail agenda pernikahan dari H-1 hingga selesai resepsi</p>
                </div>
                <button className="btn-rose px-8 shadow-lg shadow-rose-gold/20 flex items-center gap-2" onClick={openAdd}>
                    <span>+</span> Tambah Agenda Baru
                </button>
            </div>

            <div className="flex gap-2 mb-10 overflow-x-auto pb-4 scrollbar-hide">
                {['Semua', ...SESI].map(f => (
                    <button 
                        key={f} 
                        className={`filter-btn whitespace-nowrap px-6 py-2.5 text-[11px] font-black uppercase tracking-widest ${filter === f ? 'active' : ''}`} 
                        onClick={() => setFilter(f)}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {loading && items.length === 0 ? (
                <div className="text-center py-24 text-brown-muted font-playfair italic">Menyiapkan urutan acara pernikahanmu...</div>
            ) : displayed.length === 0 ? (
                <div className="card text-center py-20 shadow-sm border-ivory/50 bg-ivory/5">
                    <div className="w-20 h-20 bg-rose-gold/10 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-inner-white">📅</div>
                    <h2 className="font-playfair text-2xl font-bold text-brown mb-2">Belum ada rundown acara</h2>
                    <p className="text-brown-muted text-sm mb-10 max-w-sm mx-auto leading-relaxed">Susun jadwal acara agar setiap momen di hari bahagia kalian berjalan dengan sempurna dan teratur.</p>
                    <button className="btn-rose px-10 py-3 text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-gold/20" onClick={openAdd}>+ Mulai Buat Rundown</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {sesiGroups.map(sesi => (
                        <div key={sesi} className="card p-0 overflow-hidden shadow-sm border-ivory/50">
                            <div className="p-6 border-b border-border bg-ivory/5">
                                <h2 className="font-playfair text-xl font-bold text-brown flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-rose-gold rounded-full inline-block"></span>
                                    {sesi}
                                </h2>
                            </div>
                            <div className="p-8">
                                <div className="relative pl-10 space-y-8">
                                    {/* Vertical Line */}
                                    <div className="absolute left-[13px] top-2 bottom-2 w-0.5 bg-ivory group-hover:bg-rose-gold/20 transition-colors"></div>
                                    
                                    {displayed.filter(i => i.sesi === sesi).map(item => (
                                        <div key={item.id} className="relative group/item">
                                            {/* Dot */}
                                            <div className="absolute -left-[36px] top-2 w-4 h-4 rounded-full bg-white border-[3px] border-rose-gold shadow-sm z-10 group-hover/item:scale-125 transition-transform"></div>
                                            
                                            <div className="bg-white border border-ivory/50 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group/card relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-gold/5 rounded-bl-full -mr-8 -mt-8 transition-all group-hover/card:scale-110"></div>
                                                
                                                <div className="flex justify-between items-start mb-3 relative z-10">
                                                    <div className="flex flex-col">
                                                        <div className="text-[11px] font-black text-rose-gold uppercase tracking-[0.15em] mb-1">
                                                            ⏰ {item.waktu || '--:--'}
                                                        </div>
                                                        {item.durasi_menit && (
                                                            <div className="text-[9px] font-bold text-brown-muted uppercase tracking-widest italic">
                                                                Durasi: {item.durasi_menit} Menit
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className={`badge ${statusBadge[item.status] || 'badge-grey'} text-[8px] font-black uppercase tracking-tighter shadow-sm px-3`}>
                                                        {item.status}
                                                    </span>
                                                </div>
                                                
                                                <h3 className="font-playfair text-lg font-bold text-brown mb-2 relative z-10 group-hover/card:text-rose-gold transition-colors">{item.event}</h3>
                                                
                                                {item.lokasi && (
                                                    <div className="text-[11px] font-bold text-brown-muted/70 flex items-center gap-2 mb-4 relative z-10 uppercase tracking-tighter">
                                                        <span className="text-rose-gold/50">📍</span> {item.lokasi}
                                                    </div>
                                                )}
                                                
                                                <div className="flex justify-end gap-2 pt-4 border-t border-ivory opacity-0 group-hover/card:opacity-100 transition-all transform translate-y-2 group-hover/card:translate-y-0 relative z-10">
                                                    <button className="btn-sm-edit px-4 shadow-sm" onClick={() => openEdit(item)}>Edit</button>
                                                    <button className="btn-sm-danger p-2 shadow-sm" onClick={() => handleDelete(item.id)}>✕</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {modal && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
                    <div className="modal-box max-w-md">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="font-playfair text-2xl font-bold text-brown">
                                    {editId ? 'Edit' : 'Tambah'} Agenda
                                </h2>
                                <p className="text-[10px] font-bold text-brown-muted uppercase tracking-widest mt-1">Detail rundown acara pernikahan</p>
                            </div>
                            <button onClick={() => setModal(false)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-ivory text-brown-muted transition-colors">✕</button>
                        </div>
                        
                        <div className="space-y-5">
                            <div className="form-group">
                                <label className="form-label">Sesi Acara</label>
                                <select className="form-select shadow-inner-white" value={form.sesi} onChange={e => setForm(p => ({ ...p, sesi: e.target.value }))}>
                                    {SESI.map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Nama Agenda / Event</label>
                                <input className="form-input shadow-inner-white" placeholder="cth: Prosesi Akad, Ramah Tamah, Lempar Bunga..." value={form.event} onChange={e => setForm(p => ({ ...p, event: e.target.value }))} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label">Waktu Mulai</label>
                                    <input type="time" className="form-input shadow-inner-white" value={form.waktu} onChange={e => setForm(p => ({ ...p, waktu: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Estimasi Durasi (menit)</label>
                                    <input type="number" className="form-input shadow-inner-white" placeholder="60" value={form.durasi_menit} onChange={e => setForm(p => ({ ...p, durasi_menit: e.target.value }))} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Lokasi Detail</label>
                                <input className="form-input shadow-inner-white" placeholder="cth: Ballroom Lt. 2, Masjid Jami, Pelaminan..." value={form.lokasi} onChange={e => setForm(p => ({ ...p, lokasi: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Status Saat Ini</label>
                                <select className="form-select shadow-inner-white" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                                    <option value="Belum">Belum Dimulai</option>
                                    <option value="Berlangsung">Sedang Berlangsung</option>
                                    <option value="Selesai">Telah Selesai</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-end mt-10 pt-8 border-t border-border">
                            <button className="btn-outline px-8 py-3 text-xs font-bold uppercase tracking-widest" onClick={() => setModal(false)}>Batal</button>
                            <button className="btn-rose px-10 py-3 text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-gold/20" onClick={handleSave} disabled={saving}>
                                {saving ? 'Menyimpan...' : 'Simpan Agenda'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}