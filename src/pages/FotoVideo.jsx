// src/pages/FotoVideo.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useWedding } from '../hooks/useWedding'
import { confirmDelete } from '../lib/swal'
import toast from 'react-hot-toast'

const rp = (n = 0) => 'Rp ' + Number(n).toLocaleString('id-ID')
const EMPTY_SHOT = { sesi: 'Akad', deskripsi: '', priority: 'High', status: 'Belum' }
const priorityBadge = { High: 'badge-red', Medium: 'badge-yellow', Low: 'badge-green' }
const statusBadge = { Done: 'badge-green', Proses: 'badge-yellow', Belum: 'badge-grey' }

export default function FotoVideo() {
    const { wedding } = useWedding()
    const [foto, setFoto] = useState(null)
    const [video, setVideo] = useState(null)
    const [shots, setShots] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalF, setModalF] = useState(false)
    const [modalS, setModalS] = useState(false)
    const [formF, setFormF] = useState({ tipe: 'foto', nama: '', no_hp: '', paket: '', total: '', dp: '' })
    const [formS, setFormS] = useState(EMPTY_SHOT)
    const [editSId, setEditSId] = useState(null)
    const [saving, setSaving] = useState(false)
    const [activeTipe, setActiveTipe] = useState('foto')

    useEffect(() => { if (wedding) fetchData() }, [wedding])

    const fetchData = async () => {
        setLoading(true)
        const [fRes, vRes, sRes] = await Promise.all([
            supabase.from('dokumentasi_vendor').select('*').eq('wedding_id', wedding.id).eq('tipe', 'foto').single(),
            supabase.from('dokumentasi_vendor').select('*').eq('wedding_id', wedding.id).eq('tipe', 'video').single(),
            supabase.from('shot_list').select('*').eq('wedding_id', wedding.id).order('created_at'),
        ])
        if (fRes.data) setFoto(fRes.data)
        if (vRes.data) setVideo(vRes.data)
        setShots(sRes.data || [])
        setLoading(false)
    }

    const openVendorModal = (tipe) => {
        const existing = tipe === 'foto' ? foto : video
        setFormF(existing || { tipe, nama: '', no_hp: '', paket: '', total: '', dp: '' })
        setActiveTipe(tipe)
        setModalF(true)
    }

    const saveVendor = async () => {
        setSaving(true)
        const payload = { ...formF, tipe: activeTipe, total: Number(formF.total) || 0, dp: Number(formF.dp) || 0, wedding_id: wedding.id }
        const existing = activeTipe === 'foto' ? foto : video
        if (existing) { await supabase.from('dokumentasi_vendor').update(payload).eq('id', existing.id) }
        else { await supabase.from('dokumentasi_vendor').insert(payload) }
        toast.success('Data disimpan!'); setModalF(false); fetchData(); setSaving(false)
    }

    const openAddShot = () => { setFormS(EMPTY_SHOT); setEditSId(null); setModalS(true) }
    const openEditShot = (s) => { setFormS({ sesi: s.sesi, deskripsi: s.deskripsi, priority: s.priority, status: s.status }); setEditSId(s.id); setModalS(true) }

    const saveShot = async () => {
        if (!formS.deskripsi) { toast.error('Deskripsi shot wajib diisi!'); return }
        setSaving(true)
        const payload = { ...formS, wedding_id: wedding.id }
        if (editSId) { await supabase.from('shot_list').update(payload).eq('id', editSId); toast.success('Shot diperbarui!') }
        else { await supabase.from('shot_list').insert(payload); toast.success('Shot ditambahkan!') }
        setModalS(false); fetchData(); setSaving(false)
    }

    const deleteShot = async (id) => {
        const result = await confirmDelete('Hapus shot ini?', 'Bidikan ini akan dihapus dari daftar.')
        if (!result.isConfirmed) return

        await supabase.from('shot_list').delete().eq('id', id)
        toast.success('Dihapus!')
        fetchData()
    }

    const deleteVendor = async (tipe) => {
        const existing = tipe === 'foto' ? foto : video
        if (!existing) return
        const result = await confirmDelete(`Hapus Vendor ${tipe === 'foto' ? 'Fotografer' : 'Videografer'}?`, 'Data kontrak dan pembayaran vendor ini akan dihapus permanen.')
        if (!result.isConfirmed) return
        
        await supabase.from('dokumentasi_vendor').delete().eq('id', existing.id)
        toast.success('Vendor dihapus!')
        if (tipe === 'foto') setFoto(null)
        else setVideo(null)
        fetchData()
    }

    const VendorCard = ({ tipe, data }) => (
        <div className="card h-full flex flex-col">
            <div className="p-6 border-b border-border bg-ivory/10 flex justify-between items-center">
                <h3 className="font-playfair text-lg font-bold text-brown flex items-center gap-2">
                    {tipe === 'foto' ? '📷 Fotografer Utama' : '🎬 Videografer Utama'}
                </h3>
                <div className="flex gap-2">
                    {data && (
                        <button className="btn-outline text-[10px] py-1.5 px-3 font-bold uppercase tracking-wider text-danger border-danger hover:bg-danger hover:text-white" onClick={() => deleteVendor(tipe)}>
                            Reset
                        </button>
                    )}
                    <button className="btn-outline text-[10px] py-1.5 px-4 font-bold uppercase tracking-wider" onClick={() => openVendorModal(tipe)}>
                        {data ? 'Edit Data' : 'Setup Vendor'}
                    </button>
                </div>
            </div>
            <div className="p-2 flex-1">
                {data ? (
                    <div className="space-y-1">
                        <div className="summary-row px-5 py-4 hover:bg-ivory/30 rounded-xl transition-colors">
                            <span className="text-xs font-medium text-brown-muted">Nama Vendor</span>
                            <span className="font-bold text-brown">{data.nama || '—'}</span>
                        </div>
                        <div className="summary-row px-5 py-4 hover:bg-ivory/30 rounded-xl transition-colors">
                            <span className="text-xs font-medium text-brown-muted">No. WhatsApp</span>
                            <span className="font-bold text-brown">{data.no_hp || '—'}</span>
                        </div>
                        <div className="summary-row px-5 py-4 hover:bg-ivory/30 rounded-xl transition-colors">
                            <span className="text-xs font-medium text-brown-muted">Paket Dokumentasi</span>
                            <span className="font-bold text-brown text-[10px] text-right max-w-[140px]">{data.paket || '—'}</span>
                        </div>
                        <div className="summary-row px-5 py-4 hover:bg-ivory/30 rounded-xl transition-colors border-t border-border mt-2">
                            <span className="text-xs font-medium text-brown-muted">Total Harga</span>
                            <span className="font-bold text-brown">{rp(data.total)}</span>
                        </div>
                        <div className="summary-row px-5 py-4 hover:bg-ivory/30 rounded-xl transition-colors">
                            <span className="text-xs font-medium text-brown-muted">DP / Terbayar</span>
                            <span className="font-bold text-sage bg-sage/10 px-3 py-1 rounded-full text-[10px]">{rp(data.dp)} ✓</span>
                        </div>
                        <div className="m-3 p-4 bg-rose-gold/5 rounded-xl border border-rose-gold/10">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-brown uppercase tracking-widest">Sisa Pelunasan</span>
                                <span className="font-playfair text-lg font-black text-danger">{rp((data.total || 0) - (data.dp || 0))}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 px-6">
                        <div className="w-16 h-16 bg-ivory rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-sm">
                            {tipe === 'foto' ? '📸' : '🎞️'}
                        </div>
                        <p className="text-brown-muted text-sm font-medium italic mb-8">Data vendor {tipe} belum diatur.</p>
                        <button className="btn-rose px-8 shadow-lg shadow-rose-gold/20" onClick={() => openVendorModal(tipe)}>+ Atur Sekarang</button>
                    </div>
                )}
            </div>
        </div>
    )

    if (loading) return <div className="text-center py-20 text-brown-muted font-playfair italic">Mempersiapkan shot list dokumentasi...</div>

    return (
        <div className="animate-fade-in pb-12">
            <div className="section-header">
                <div>
                    <h1 className="section-title">Foto & Video 📷</h1>
                    <p className="section-subtitle">Daftar bidikan (shot list), brief vendor, dan detail dokumentasi</p>
                </div>
                <button className="btn-rose px-8 shadow-lg shadow-rose-gold/20" onClick={openAddShot}>+ Tambah Shot Baru</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                <VendorCard tipe="foto" data={foto} />
                <VendorCard tipe="video" data={video} />
            </div>

            <div className="card p-0 overflow-hidden group/table">
                <div className="p-6 border-b border-border bg-ivory/5">
                    <h2 className="font-playfair text-xl font-bold text-brown">Shot List & Mandatory Brief 📝</h2>
                </div>
                <div className="overflow-x-auto">
                    <table>
                        <thead>
                            <tr>
                                <th className="th">Sesi Acara</th>
                                <th className="th">Deskripsi Shot / Momen Penting</th>
                                <th className="th">Prioritas</th>
                                <th className="th">Status</th>
                                <th className="th text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shots.length === 0 ? (
                                <tr><td colSpan={5} className="td text-center py-24 text-brown-muted italic">Belum ada daftar bidikan yang wajib diambil.</td></tr>
                            ) : shots.map(s => (
                                <tr key={s.id} className="tr group">
                                    <td className="td">
                                        <span className="badge-rose text-[9px] px-2.5 py-1 uppercase font-bold tracking-tighter opacity-80">{s.sesi}</span>
                                    </td>
                                    <td className="td font-bold text-brown group-hover:text-rose-gold transition-colors">{s.deskripsi}</td>
                                    <td className="td">
                                        <span className={`badge ${priorityBadge[s.priority] || 'badge-grey'} text-[9px]`}>
                                            {s.priority}
                                        </span>
                                    </td>
                                    <td className="td">
                                        <span className={`badge ${statusBadge[s.status] || 'badge-grey'} text-[9px]`}>
                                            {s.status === 'Done' ? 'Selesai' : s.status}
                                        </span>
                                    </td>
                                    <td className="td text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="btn-sm-edit" onClick={() => openEditShot(s)}>Edit</button>
                                            <button className="btn-sm-danger p-1" onClick={() => deleteShot(s.id)}>✕</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Vendor */}
            {modalF && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModalF(false)}>
                    <div className="modal-box max-w-md">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-playfair text-xl font-bold text-brown">
                                Data {activeTipe === 'foto' ? 'Fotografer' : 'Videografer'}
                            </h2>
                            <button onClick={() => setModalF(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-ivory text-brown-muted transition-colors">✕</button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="form-group">
                                <label className="form-label">Nama Vendor / Studio</label>
                                <input className="form-input" placeholder="Nama..." value={formF.nama || ''} onChange={e => setFormF(p => ({ ...p, nama: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Nomor WhatsApp</label>
                                <input className="form-input" placeholder="08xx..." value={formF.no_hp || ''} onChange={e => setFormF(p => ({ ...p, no_hp: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Paket Dokumentasi</label>
                                <textarea className="form-textarea" rows={2} placeholder="cth: Prewedding + Akad + Resepsi..." value={formF.paket || ''} onChange={e => setFormF(p => ({ ...p, paket: e.target.value }))} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label">Total Harga (Rp)</label>
                                    <input type="number" className="form-input" placeholder="0" value={formF.total || ''} onChange={e => setFormF(p => ({ ...p, total: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">DP Dibayar (Rp)</label>
                                    <input type="number" className="form-input" placeholder="0" value={formF.dp || ''} onChange={e => setFormF(p => ({ ...p, dp: e.target.value }))} />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-border">
                            <button className="btn-outline px-6" onClick={() => setModalF(false)}>Batal</button>
                            <button className="btn-rose px-8" onClick={saveVendor} disabled={saving}>
                                {saving ? 'Menyimpan...' : 'Simpan Data Vendor'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Shot */}
            {modalS && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModalS(false)}>
                    <div className="modal-box max-w-md">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-playfair text-xl font-bold text-brown">
                                {editSId ? 'Edit' : 'Tambah'} Shot List
                            </h2>
                            <button onClick={() => setModalS(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-ivory text-brown-muted transition-colors">✕</button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="form-group">
                                <label className="form-label">Sesi Acara</label>
                                <select className="form-select" value={formS.sesi} onChange={e => setFormS(p => ({ ...p, sesi: e.target.value }))}>
                                    {['Prewedding', 'Akad', 'Resepsi', 'Lamaran', 'Siraman', 'After Party'].map(v => <option key={v}>{v}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Deskripsi Bidikan / Momen</label>
                                <input className="form-input" placeholder="cth: Close up tukar cincin & ijab kabul..." value={formS.deskripsi} onChange={e => setFormS(p => ({ ...p, deskripsi: e.target.value }))} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label">Prioritas</label>
                                    <select className="form-select" value={formS.priority} onChange={e => setFormS(p => ({ ...p, priority: e.target.value }))}>
                                        {['High', 'Medium', 'Low'].map(v => <option key={v}>{v}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Status</label>
                                    <select className="form-select" value={formS.status} onChange={e => setFormS(p => ({ ...p, status: e.target.value }))}>
                                        {['Belum', 'Proses', 'Done'].map(v => <option key={v}>{v === 'Done' ? 'Selesai' : v}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-border">
                            <button className="btn-outline px-6" onClick={() => setModalS(false)}>Batal</button>
                            <button className="btn-rose px-8" onClick={saveShot} disabled={saving}>
                                {saving ? 'Menyimpan...' : 'Simpan Shot'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}