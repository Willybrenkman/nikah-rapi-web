import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useWedding } from '../hooks/useWedding'
import { confirmDelete } from '../lib/swal'
import toast from 'react-hot-toast'

const rp = (n = 0) => 'Rp ' + Number(n).toLocaleString('id-ID')
const AREA = ['Altar/Pelaminan', 'Pintu Masuk', 'Area Tamu', 'Backdrop Foto', 'Seluruh Area', 'Lainnya']
const STATUS = ['Belum', 'Proses', 'Selesai']
const statusBadge = { Selesai: 'badge-green', Proses: 'badge-yellow', Belum: 'badge-grey' }
const EMPTY = { nama: '', area: 'Altar/Pelaminan', estimasi: '', status: 'Belum', catatan: '' }
const DEFAULT_PALETTE = ['#C9956C', '#E8C4B8', '#8BAF8B', '#FDFAF6', '#2C1810']

export default function Dekorasi() {
    const { wedding } = useWedding()
    const [items, setItems] = useState([])
    const [tema, setTema] = useState('')
    const [moodboard, setMoodboard] = useState('')
    const [palet, setPalet] = useState(DEFAULT_PALETTE)
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [form, setForm] = useState(EMPTY)
    const [editId, setEditId] = useState(null)
    const [saving, setSaving] = useState(false)

    useEffect(() => { if (wedding) fetchData() }, [wedding])

    const fetchData = async () => {
        setLoading(true)
        const [dekRes, profRes] = await Promise.all([
            supabase.from('dekorasi_items').select('*').eq('wedding_id', wedding.id).order('created_at'),
            // Kita coba fetch palet_warna jika kolomnya sudah ada
            supabase.from('wedding_profiles').select('*').eq('id', wedding.id).single(),
        ])
        setItems(dekRes.data || [])
        if (profRes.data) { 
            setTema(profRes.data.tema_dekorasi || '')
            setMoodboard(profRes.data.moodboard_notes || '')
            if (profRes.data.palet_warna && profRes.data.palet_warna.length > 0) {
                setPalet(profRes.data.palet_warna)
            }
        }
        setLoading(false)
    }

    const saveTema = async () => {
        const payload = { tema_dekorasi: tema, moodboard_notes: moodboard, palet_warna: palet }
        
        // Cek kolom yang tersedia agar tidak error jika kolom palet_warna belum ada
        const { data } = await supabase.from('wedding_profiles').select('*').limit(1)
        const safePayload = {}
        if (data && data.length > 0) {
            const dbCols = Object.keys(data[0])
            Object.keys(payload).forEach(k => {
                if (dbCols.includes(k)) safePayload[k] = payload[k]
            })
        } else {
            Object.assign(safePayload, payload)
        }

        await supabase.from('wedding_profiles').update(safePayload).eq('id', wedding.id)
        toast.success('Tema & Palet disimpan!')
    }

    const openAdd = () => { setForm(EMPTY); setEditId(null); setModal(true) }
    const openEdit = (i) => { setForm({ nama: i.nama, area: i.area, estimasi: i.estimasi || '', status: i.status || 'Belum', catatan: i.catatan || '' }); setEditId(i.id); setModal(true) }

    const handleSave = async () => {
        if (!form.nama) { toast.error('Nama item wajib!'); return }
        setSaving(true)
        const payload = { ...form, estimasi: Number(form.estimasi) || 0, wedding_id: wedding.id }
        if (editId) { await supabase.from('dekorasi_items').update(payload).eq('id', editId); toast.success('Diperbarui!') }
        else { await supabase.from('dekorasi_items').insert(payload); toast.success('Ditambahkan!') }
        setModal(false); fetchData(); setSaving(false)
    }

    const handleDelete = async (id) => {
        const result = await confirmDelete('Hapus item dekorasi?', 'Item ini akan dihapus dari daftar.')
        if (!result.isConfirmed) return
        await supabase.from('dekorasi_items').delete().eq('id', id)
        toast.success('Dihapus!')
        fetchData()
    }

    const updateColor = (index, color) => {
        const newPalet = [...palet]
        newPalet[index] = color
        setPalet(newPalet)
    }

    const selesai = items.filter(i => i.status === 'Selesai').length
    const totalEst = items.reduce((a, i) => a + (i.estimasi || 0), 0)

    if (loading && items.length === 0) return <div className="text-center py-20 text-brown-muted font-playfair italic">Membayangkan konsep dekorasi impianmu...</div>

    return (
        <div className="animate-fade-in pb-12">
            <div className="section-header">
                <div>
                    <h1 className="section-title">Dekorasi & Tema 🎨</h1>
                    <p className="section-subtitle">Moodboard, konsep visual, dan rincian item dekorasi pernikahan</p>
                </div>
                <button className="btn-rose px-8 shadow-lg shadow-rose-gold/20" onClick={openAdd}>+ Tambah Item Dekor</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
                {/* Theme Identity */}
                <div className="card lg:col-span-2 h-fit">
                    <div className="p-6 border-b border-border bg-ivory/10 flex items-center gap-3">
                        <span className="text-xl">✨</span>
                        <h2 className="font-playfair text-lg font-bold text-brown">Identitas Tema & Konsep</h2>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="form-group">
                            <label className="form-label">Tema Pernikahan Utama</label>
                            <input className="form-input shadow-inner-white" placeholder="cth: Rustic Elegance — Sage & Rose Gold" value={tema} onChange={e => setTema(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label text-[10px] uppercase tracking-widest font-bold">Palet Warna Utama (Klik untuk ubah)</label>
                            <div className="flex gap-3 flex-wrap bg-ivory/20 p-4 rounded-2xl border border-border">
                                {palet.map((w, i) => (
                                    <div key={i} className="group relative w-10 h-10 rounded-xl shadow-md border-2 border-white transition-transform hover:scale-110 cursor-pointer overflow-hidden">
                                        <input 
                                            type="color" 
                                            value={w} 
                                            onChange={(e) => updateColor(i, e.target.value)} 
                                            className="absolute -inset-2 w-16 h-16 p-0 m-0 border-none cursor-pointer opacity-0 z-10" 
                                        />
                                        <div className="absolute inset-0" style={{ background: w }} />
                                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[8px] font-bold text-brown-muted opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">{w}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Catatan Moodboard</label>
                            <textarea className="form-textarea min-h-[140px] shadow-inner-white border-rose-gold/10" placeholder="Jelaskan konsep, jenis bunga utama, detail centerpiece, atau nuansa pencahayaan yang diinginkan..." value={moodboard} onChange={e => setMoodboard(e.target.value)} />
                        </div>
                        <button className="btn-rose w-full py-4 text-sm font-black uppercase tracking-widest shadow-lg shadow-rose-gold/20 active:scale-95 transition-all" onClick={saveTema}>Simpan Konsep Visual</button>
                    </div>
                </div>

                {/* Decoration items table */}
                <div className="card lg:col-span-3 p-0 overflow-hidden flex flex-col group/table">
                    <div className="p-6 border-b border-border flex justify-between items-center bg-ivory/5">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">🌸</span>
                            <h2 className="font-playfair text-lg font-bold text-brown">Rincian Item Dekorasi</h2>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black uppercase tracking-widest text-rose-gold">{selesai}/{items.length} Siap</span>
                            <span className="text-xs font-bold text-brown-muted italic">{rp(totalEst)}</span>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto flex-1">
                        <table>
                            <thead>
                                <tr>
                                    <th className="th">Nama Item</th>
                                    <th className="th">Area Lokasi</th>
                                    <th className="th">Est. Biaya</th>
                                    <th className="th">Status</th>
                                    <th className="th text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.length === 0 ? (
                                    <tr><td colSpan={5} className="td text-center py-24 text-brown-muted italic">Belum ada rincian item dekorasi yang ditambahkan.</td></tr>
                                ) : items.map(item => (
                                    <tr key={item.id} className="tr group">
                                        <td className="td">
                                            <div className="font-bold text-brown group-hover:text-rose-gold transition-colors">{item.nama}</div>
                                        </td>
                                        <td className="td">
                                            <span className="badge-rose text-[9px] px-2.5 py-1 uppercase font-bold tracking-tighter opacity-80">{item.area}</span>
                                        </td>
                                        <td className="td text-xs font-bold text-brown">{rp(item.estimasi)}</td>
                                        <td className="td">
                                            <span className={`badge ${statusBadge[item.status] || 'badge-grey'} text-[9px]`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="td text-right">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="btn-sm-edit" onClick={() => openEdit(item)}>Edit</button>
                                                <button className="btn-sm-danger p-1" onClick={() => handleDelete(item.id)}>✕</button>
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
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-playfair text-xl font-bold text-brown">
                                {editId ? 'Edit' : 'Tambah'} Item Dekorasi
                            </h2>
                            <button onClick={() => setModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-ivory text-brown-muted transition-colors">✕</button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="form-group">
                                <label className="form-label">Nama Item Dekorasi</label>
                                <input className="form-input" placeholder="cth: Backdrop Pelaminan, Pintu Masuk..." value={form.nama} onChange={e => setForm(p => ({ ...p, nama: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Area Penempatan</label>
                                <select className="form-select" value={form.area} onChange={e => setForm(p => ({ ...p, area: e.target.value }))}>
                                    {AREA.map(v => <option key={v}>{v}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label">Estimasi Biaya (Rp)</label>
                                    <input type="number" className="form-input" placeholder="0" value={form.estimasi} onChange={e => setForm(p => ({ ...p, estimasi: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Status Pengerjaan</label>
                                    <select className="form-select" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                                        {STATUS.map(v => <option key={v}>{v}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Catatan Item</label>
                                <textarea className="form-textarea" rows={2} placeholder="Detail khusus item ini..." value={form.catatan || ''} onChange={e => setForm(p => ({ ...p, catatan: e.target.value }))} />
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-border">
                            <button className="btn-outline px-6" onClick={() => setModal(false)}>Batal</button>
                            <button className="btn-rose px-8" onClick={handleSave} disabled={saving}>
                                {saving ? 'Menyimpan...' : 'Simpan Data Item'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}