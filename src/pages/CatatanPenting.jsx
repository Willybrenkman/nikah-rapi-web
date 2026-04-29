// src/pages/CatatanPenting.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useWedding } from '../hooks/useWedding'
import toast from 'react-hot-toast'

const EMPTY = { judul: '', kategori: 'Vendor', priority: 'Medium', isi: '' }
const priorityBadge = { Urgent: 'badge-red', Medium: 'badge-yellow', Info: 'badge-blue', Done: 'badge-green' }

export default function CatatanPenting() {
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
        const { data } = await supabase.from('catatan').select('*').eq('wedding_id', wedding.id).order('created_at', { ascending: false })
        setItems(data || [])
        setLoading(false)
    }

    const openAdd = () => { setForm(EMPTY); setEditId(null); setModal(true) }
    const openEdit = (i) => { setForm({ judul: i.judul, kategori: i.kategori, priority: i.priority, isi: i.isi }); setEditId(i.id); setModal(true) }

    const handleSave = async () => {
        if (!form.judul) { toast.error('Judul wajib diisi!'); return }
        setSaving(true)
        const payload = { ...form, wedding_id: wedding.id }
        if (editId) { await supabase.from('catatan').update(payload).eq('id', editId); toast.success('Catatan diperbarui!') }
        else { await supabase.from('catatan').insert(payload); toast.success('Catatan ditambahkan!') }
        setModal(false); fetchItems(); setSaving(false)
    }

    const handleDelete = async (id) => {
        if (!confirm('Hapus catatan ini?')) return
        await supabase.from('catatan').delete().eq('id', id)
        toast.success('Dihapus!'); fetchItems()
    }

    const displayed = filter === 'Semua' ? items : items.filter(i => i.kategori === filter || i.priority === filter)
    const F = ({ label, children }) => <div style={{ marginBottom: 16 }}><label className="form-label">{label}</label>{children}</div>

    return (
        <div className="animate-fade-in">
            <div className="section-header">
                <div>
                    <div className="section-title">Catatan Penting 📝</div>
                    <div className="section-subtitle">Notes, reminder, dan hal penting lainnya</div>
                </div>
                <button className="btn-rose" onClick={openAdd}>+ Tambah Catatan</button>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                {['Semua', 'Urgent', 'Vendor', 'Keluarga', 'Dokumentasi', 'Keuangan'].map(f => (
                    <button key={f} className={`filter-btn${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
                ))}
            </div>

            {loading ? <div style={{ textAlign: 'center', padding: 40, color: '#9B8070' }}>Memuat...</div>
                : displayed.length === 0 ? <div style={{ textAlign: 'center', padding: 40, color: '#9B8070' }}>Belum ada catatan.</div>
                    : displayed.map(item => (
                        <div key={item.id} className="note-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                                <div style={{ fontWeight: 600, fontSize: 14 }}>{item.judul}</div>
                                <div style={{ display: 'flex', gap: 6 }}>
                                    <button className="btn-sm-edit" onClick={() => openEdit(item)}>Edit</button>
                                    <button className="btn-sm-danger" onClick={() => handleDelete(item.id)}>Hapus</button>
                                </div>
                            </div>
                            <div style={{ fontSize: 13, color: '#9B8070', lineHeight: 1.6 }}>{item.isi}</div>
                            <div style={{ fontSize: 11, color: '#9B8070', marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                                <span>📅 {new Date(item.created_at).toLocaleDateString('id-ID')}</span>
                                <span>·</span>
                                <span>{item.kategori}</span>
                                <span>·</span>
                                <span className={`badge ${priorityBadge[item.priority] || 'badge-grey'}`}>{item.priority}</span>
                            </div>
                        </div>
                    ))}

            {modal && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
                    <div className="modal-box">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18 }}>{editId ? 'Edit' : 'Tambah'} Catatan</div>
                            <button onClick={() => setModal(false)} style={{ width: 32, height: 32, borderRadius: 8, background: '#FDFAF6', border: 'none', cursor: 'pointer', fontSize: 16 }}>✕</button>
                        </div>
                        <F label="Judul Catatan"><input className="form-input" placeholder="Judul singkat..." value={form.judul} onChange={e => setForm(p => ({ ...p, judul: e.target.value }))} /></F>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <F label="Kategori">
                                <select className="form-select" value={form.kategori} onChange={e => setForm(p => ({ ...p, kategori: e.target.value }))}>
                                    {['Vendor', 'Keluarga', 'Dokumentasi', 'Keuangan', 'Hiburan', 'Lainnya'].map(v => <option key={v}>{v}</option>)}
                                </select>
                            </F>
                            <F label="Priority">
                                <select className="form-select" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
                                    {['Urgent', 'Medium', 'Info', 'Done'].map(v => <option key={v}>{v}</option>)}
                                </select>
                            </F>
                        </div>
                        <F label="Isi Catatan"><textarea className="form-textarea" rows={5} placeholder="Tulis catatan..." value={form.isi} onChange={e => setForm(p => ({ ...p, isi: e.target.value }))} /></F>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24, paddingTop: 20, borderTop: '1px solid #F0E6DF' }}>
                            <button className="btn-outline" onClick={() => setModal(false)}>Batal</button>
                            <button className="btn-rose" onClick={handleSave} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}