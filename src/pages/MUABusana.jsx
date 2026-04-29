// src/pages/MUABusana.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useWedding } from '../hooks/useWedding'
import { confirmDelete } from '../lib/swal'
import toast from 'react-hot-toast'

const rp = (n = 0) => 'Rp ' + Number(n).toLocaleString('id-ID')

export default function MUABusana() {
    const { wedding } = useWedding()
    const [mua, setMua] = useState(null)
    const [jadwal, setJadwal] = useState([])
    const [aksesori, setAksesori] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalMUA, setModalMUA] = useState(false)
    const [modalJ, setModalJ] = useState(false)
    const [formMUA, setFormMUA] = useState({ nama_mua: '', no_hp: '', paket: '', total: '', dp: '', catatan: '' })
    const [formJ, setFormJ] = useState({ tanggal: '', waktu: '', agenda: '', status: 'Belum' })
    const [editJId, setEditJId] = useState(null)
    const [saving, setSaving] = useState(false)

    useEffect(() => { if (wedding) fetchData() }, [wedding])

    const fetchData = async () => {
        setLoading(true)
        const [muaRes, jadwalRes, aksRes] = await Promise.all([
            supabase.from('mua_detail').select('*').eq('wedding_id', wedding.id).single(),
            supabase.from('mua_jadwal').select('*').eq('wedding_id', wedding.id).order('tanggal'),
            supabase.from('aksesori_busana').select('*').eq('wedding_id', wedding.id).order('created_at'),
        ])
        if (muaRes.data) { setMua(muaRes.data); setFormMUA(muaRes.data) }
        setJadwal(jadwalRes.data || [])
        setAksesori(aksRes.data || [])
        setLoading(false)
    }

    const saveMUA = async () => {
        setSaving(true)
        const payload = { ...formMUA, total: Number(formMUA.total) || 0, dp: Number(formMUA.dp) || 0, wedding_id: wedding.id }
        if (mua) { await supabase.from('mua_detail').update(payload).eq('id', mua.id) }
        else { await supabase.from('mua_detail').insert(payload) }
        toast.success('Data MUA disimpan!'); setModalMUA(false); fetchData(); setSaving(false)
    }

    const deleteMUA = async () => {
        if (!mua) return
        const result = await confirmDelete('Hapus Vendor MUA?', 'Semua data vendor rias ini akan dihapus permanen.')
        if (!result.isConfirmed) return
        
        await supabase.from('mua_detail').delete().eq('id', mua.id)
        toast.success('Vendor MUA dihapus!')
        setMua(null)
        setFormMUA({ nama_mua: '', no_hp: '', paket: '', total: '', dp: '', catatan: '' })
        fetchData()
    }

    const openAddJ = () => { setFormJ({ tanggal: '', waktu: '', agenda: '', status: 'Belum' }); setEditJId(null); setModalJ(true) }
    const openEditJ = (j) => { setFormJ({ tanggal: j.tanggal || '', waktu: j.waktu || '', agenda: j.agenda || '', status: j.status || 'Belum' }); setEditJId(j.id); setModalJ(true) }

    const saveJadwal = async () => {
        if (!formJ.agenda) { toast.error('Agenda wajib diisi!'); return }
        setSaving(true)
        const payload = { ...formJ, wedding_id: wedding.id }
        if (editJId) { await supabase.from('mua_jadwal').update(payload).eq('id', editJId); toast.success('Jadwal diperbarui!') }
        else { await supabase.from('mua_jadwal').insert(payload); toast.success('Jadwal ditambahkan!') }
        setModalJ(false); fetchData(); setSaving(false)
    }

    const toggleAksesori = async (item) => {
        await supabase.from('aksesori_busana').update({ selesai: !item.selesai }).eq('id', item.id)
        fetchData()
    }

    const sisa = (mua?.total || 0) - (mua?.dp || 0)
    const statusBadge = { Selesai: 'badge-green', Proses: 'badge-yellow', Belum: 'badge-grey' }

    if (loading) return <div className="text-center py-20 text-brown-muted font-playfair italic">Memuat detail riasan & busana...</div>

    return (
        <div className="animate-fade-in pb-12">
            <div className="section-header">
                <div>
                    <h1 className="section-title">MUA & Busana 💄</h1>
                    <p className="section-subtitle">Jadwal riasan, fitting, dan detail busana pengantin</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn-outline px-6 whitespace-nowrap" onClick={openAddJ}>+ Jadwal Baru</button>
                    {mua && (
                        <button className="btn-outline px-4 text-danger border-danger hover:bg-danger hover:text-white" onClick={deleteMUA}>
                            🗑️ Reset Vendor
                        </button>
                    )}
                    <button className="btn-rose px-6 flex items-center gap-2 shadow-lg shadow-rose-gold/20" onClick={() => setModalMUA(true)}>
                        <span>⚙️</span> {mua ? 'Edit' : 'Atur'} MUA
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
                {/* MUA detail */}
                <div className="card lg:col-span-2 h-full">
                    <div className="p-6 border-b border-border bg-ivory/10">
                        <h2 className="font-playfair text-xl font-bold text-brown">Partner MUA</h2>
                    </div>
                    <div className="p-2">
                        {mua ? (
                            <div className="space-y-1">
                                <div className="summary-row px-5 py-4 hover:bg-ivory/30 rounded-xl transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">👤</span>
                                        <span className="text-sm font-medium text-brown-muted">Nama MUA</span>
                                    </div>
                                    <span className="font-bold text-brown">{mua.nama_mua || '—'}</span>
                                </div>
                                <div className="summary-row px-5 py-4 hover:bg-ivory/30 rounded-xl transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">📞</span>
                                        <span className="text-sm font-medium text-brown-muted">Kontak</span>
                                    </div>
                                    <span className="font-bold text-brown">{mua.no_hp || '—'}</span>
                                </div>
                                <div className="summary-row px-5 py-4 hover:bg-ivory/30 rounded-xl transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">🏷️</span>
                                        <span className="text-sm font-medium text-brown-muted">Paket Dipilih</span>
                                    </div>
                                    <span className="font-bold text-brown text-xs text-right max-w-[150px]">{mua.paket || '—'}</span>
                                </div>
                                <div className="summary-row px-5 py-4 hover:bg-ivory/30 rounded-xl transition-colors border-t border-border mt-2">
                                    <span className="text-sm font-medium text-brown-muted">Total Investasi</span>
                                    <span className="font-bold text-brown">{rp(mua.total)}</span>
                                </div>
                                <div className="summary-row px-5 py-4 hover:bg-ivory/30 rounded-xl transition-colors">
                                    <span className="text-sm font-medium text-brown-muted">DP / Terbayar</span>
                                    <span className="font-bold text-sage bg-sage/10 px-3 py-1 rounded-full text-xs">{rp(mua.dp)}</span>
                                </div>
                                <div className="m-3 p-5 bg-gradient-to-br from-rose-gold to-dusty-pink/30 rounded-2xl shadow-inner-white border border-rose-gold/10">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-brown uppercase tracking-widest">Sisa Pelunasan</span>
                                        <span className="font-playfair text-xl font-black text-brown">{rp(sisa)}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-20 px-6">
                                <div className="w-16 h-16 bg-ivory rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-sm">💄</div>
                                <p className="text-brown-muted text-sm font-medium italic mb-8">Belum ada data MUA yang terdaftar. Atur sekarang untuk melacak jadwal trial & fitting.</p>
                                <button className="btn-rose px-10 shadow-lg shadow-rose-gold/20" onClick={() => setModalMUA(true)}>+ Setup MUA Sekarang</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Jadwal */}
                <div className="card lg:col-span-3 p-0 overflow-hidden group/table">
                    <div className="p-6 border-b border-border flex justify-between items-center bg-ivory/5">
                        <h2 className="font-playfair text-xl font-bold text-brown">Timeline Agenda Rias</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table>
                            <thead>
                                <tr>
                                    <th className="th">Tgl & Waktu</th>
                                    <th className="th">Agenda Kegiatan</th>
                                    <th className="th">Status</th>
                                    <th className="th text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jadwal.length === 0 ? (
                                    <tr><td colSpan={4} className="td text-center py-24 text-brown-muted italic">Belum ada jadwal fitting atau trial.</td></tr>
                                ) : jadwal.map(j => (
                                    <tr key={j.id} className="tr group">
                                        <td className="td">
                                            <div className="text-xs font-bold text-brown">
                                                {j.tanggal ? new Date(j.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                                            </div>
                                            <div className="text-[10px] text-brown-muted italic">{j.waktu || '—'}</div>
                                        </td>
                                        <td className="td font-bold text-brown group-hover:text-rose-gold transition-colors">{j.agenda}</td>
                                        <td className="td">
                                            <span className={`badge ${statusBadge[j.status] || 'badge-grey'} text-[9px]`}>
                                                {j.status}
                                            </span>
                                        </td>
                                        <td className="td text-right">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="btn-sm-edit" onClick={() => openEditJ(j)}>Edit</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Aksesori checklist */}
            {aksesori.length > 0 && (
                <div className="card group">
                    <div className="p-6 border-b border-border flex items-center justify-between bg-ivory/5">
                        <h2 className="font-playfair text-xl font-bold text-brown">Checklist Kelengkapan Aksesori 👑</h2>
                        <span className="text-[10px] font-bold text-brown-muted uppercase tracking-widest">{aksesori.filter(a => a.selesai).length} dari {aksesori.length} siap</span>
                    </div>
                    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {aksesori.map(a => (
                            <label key={a.id} className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${a.selesai ? 'bg-sage/5 border-sage/20' : 'bg-white border-border hover:border-rose-gold/30'}`}>
                                <input type="checkbox" checked={!!a.selesai} onChange={() => toggleAksesori(a)} className="w-5 h-5 rounded-md border-brown-muted/30 text-rose-gold focus:ring-rose-gold transition-all" />
                                <span className={`text-sm font-bold transition-all ${a.selesai ? 'line-through text-brown-muted opacity-50' : 'text-brown'}`}>
                                    {a.nama}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal MUA */}
            {modalMUA && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModalMUA(false)}>
                    <div className="modal-box max-w-md">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-playfair text-xl font-bold text-brown">Informasi Partner MUA</h2>
                            <button onClick={() => setModalMUA(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-ivory text-brown-muted transition-colors">✕</button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="form-group">
                                <label className="form-label">Nama Vendor MUA</label>
                                <input className="form-input" placeholder="Nama..." value={formMUA.nama_mua || ''} onChange={e => setFormMUA(p => ({ ...p, nama_mua: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Nomor WhatsApp</label>
                                <input className="form-input" placeholder="08xx..." value={formMUA.no_hp || ''} onChange={e => setFormMUA(p => ({ ...p, no_hp: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Rincian Paket</label>
                                <textarea className="form-textarea" rows={2} placeholder="cth: Pengantin Lengkap (Akad + Resepsi)..." value={formMUA.paket || ''} onChange={e => setFormMUA(p => ({ ...p, paket: e.target.value }))} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label">Total Harga (Rp)</label>
                                    <input type="number" className="form-input" placeholder="0" value={formMUA.total || ''} onChange={e => setFormMUA(p => ({ ...p, total: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">DP Dibayar (Rp)</label>
                                    <input type="number" className="form-input" placeholder="0" value={formMUA.dp || ''} onChange={e => setFormMUA(p => ({ ...p, dp: e.target.value }))} />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-border">
                            <button className="btn-outline px-6" onClick={() => setModalMUA(false)}>Batal</button>
                            <button className="btn-rose px-8" onClick={saveMUA} disabled={saving}>
                                {saving ? 'Menyimpan...' : 'Simpan Data MUA'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Jadwal */}
            {modalJ && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModalJ(false)}>
                    <div className="modal-box max-w-md">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-playfair text-xl font-bold text-brown">
                                {editJId ? 'Edit' : 'Tambah'} Jadwal Kegiatan
                            </h2>
                            <button onClick={() => setModalJ(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-ivory text-brown-muted transition-colors">✕</button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="form-group">
                                <label className="form-label">Agenda Kegiatan</label>
                                <input className="form-input" placeholder="cth: Trial MUA Akad..." value={formJ.agenda} onChange={e => setFormJ(p => ({ ...p, agenda: e.target.value }))} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label">Tanggal</label>
                                    <input type="date" className="form-input" value={formJ.tanggal} onChange={e => setFormJ(p => ({ ...p, tanggal: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Waktu</label>
                                    <input type="time" className="form-input" value={formJ.waktu} onChange={e => setFormJ(p => ({ ...p, waktu: e.target.value }))} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select className="form-select" value={formJ.status} onChange={e => setFormJ(p => ({ ...p, status: e.target.value }))}>
                                    {['Belum', 'Proses', 'Selesai'].map(v => <option key={v}>{v}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-border">
                            <button className="btn-outline px-6" onClick={() => setModalJ(false)}>Batal</button>
                            <button className="btn-rose px-8" onClick={saveJadwal} disabled={saving}>
                                {saving ? 'Menyimpan...' : 'Simpan Jadwal'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}