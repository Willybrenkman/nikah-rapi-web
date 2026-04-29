// src/pages/CincinMahar.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useWedding } from '../hooks/useWedding'
import { confirmDelete } from '../lib/swal'
import toast from 'react-hot-toast'

const rp = (n = 0) => 'Rp ' + Number(n).toLocaleString('id-ID')
const AKAD_ITEMS = ['Sajadah Akad', 'Al-Quran', 'Tasbih', 'Kotak Mahar', 'Cincin Akad', 'Buku Nikah (KUA)', 'Vas Bunga Meja Akad', 'Penghulu Dikonfirmasi']

export default function CincinMahar() {
    const { wedding } = useWedding()
    const [data, setData] = useState(null)
    const [checklist, setChecklist] = useState({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState({
        jenis_mahar: '', nominal_mahar: '', barang_mahar: '', penyajian_mahar: '', vendor_mahar: '', harga_mahar: '', status_mahar: 'Belum',
        ukuran_cincin_1: '', ukuran_cincin_2: '', bahan_cincin: '', desain_cincin: '', vendor_cincin: '', harga_cincin: '', tanggal_ambil: '', status_cincin: 'Belum'
    })

    useEffect(() => { if (wedding) fetchData() }, [wedding])

    const fetchData = async () => {
        setLoading(true)
        const { data: d } = await supabase.from('cincin_mahar').select('*').eq('wedding_id', wedding.id).single()
        if (d) { setData(d); setForm(d); setChecklist(d.checklist_akad || {}) }
        setLoading(false)
    }

    const handleSave = async () => {
        setSaving(true)
        const payload = { ...form, nominal_mahar: Number(form.nominal_mahar) || 0, harga_mahar: Number(form.harga_mahar) || 0, harga_cincin: Number(form.harga_cincin) || 0, checklist_akad: checklist, wedding_id: wedding.id }
        if (data) { await supabase.from('cincin_mahar').update(payload).eq('id', data.id) }
        else { await supabase.from('cincin_mahar').insert(payload) }
        toast.success('Data disimpan!'); fetchData(); setSaving(false)
    }

    const handleReset = async () => {
        if (!data) return
        const result = await confirmDelete('Reset Cincin & Mahar?', 'Semua data dan checklist akan dikosongkan. Tindakan ini tidak bisa dibatalkan.')
        if (!result.isConfirmed) return

        setSaving(true)
        const emptyForm = {
            jenis_mahar: '', nominal_mahar: '', barang_mahar: '', penyajian_mahar: '', vendor_mahar: '', harga_mahar: '', status_mahar: 'Belum',
            ukuran_cincin_1: '', ukuran_cincin_2: '', bahan_cincin: '', desain_cincin: '', vendor_cincin: '', harga_cincin: '', tanggal_ambil: '', status_cincin: 'Belum'
        }
        await supabase.from('cincin_mahar').update({ ...emptyForm, checklist_akad: {}, nominal_mahar: 0, harga_mahar: 0, harga_cincin: 0 }).eq('id', data.id)
        
        setForm(emptyForm)
        setChecklist({})
        toast.success('Data direset!')
        fetchData()
        setSaving(false)
    }

    const checkDone = AKAD_ITEMS.filter(i => checklist[i]).length
    const pct = AKAD_ITEMS.length > 0 ? Math.round(checkDone / AKAD_ITEMS.length * 100) : 0

    if (loading) return <div className="text-center py-20 text-brown-muted">Memuat...</div>

    return (
        <div className="animate-fade-in">
            <div className="section-header">
                <div>
                    <h1 className="section-title">Cincin & Mahar 💍</h1>
                    <p className="section-subtitle">Detail mahar, cincin, dan perlengkapan akad</p>
                </div>
                <div className="flex gap-2">
                    {data && (
                        <button className="btn-outline px-4 text-danger border-danger hover:bg-danger hover:text-white" onClick={handleReset} disabled={saving}>
                            🗑️ Reset
                        </button>
                    )}
                    <button className="btn-rose px-8 shadow-lg shadow-rose-gold/20" onClick={handleSave} disabled={saving}>
                        {saving ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Menyimpan...
                            </span>
                        ) : 'Simpan Perubahan'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Mahar Section */}
                <div className="card">
                    <div className="p-6 border-b border-border bg-ivory/10 flex items-center gap-3">
                        <span className="text-2xl">🎁</span>
                        <h2 className="font-playfair text-lg font-bold text-brown">Detail Mahar</h2>
                    </div>
                    
                    <div className="p-6 space-y-5">
                        <div className="form-group">
                            <label className="form-label">Jenis Mahar</label>
                            <input 
                                className="form-input" 
                                placeholder="cth: Uang + Seperangkat Alat Sholat" 
                                value={form.jenis_mahar || ''} 
                                onChange={e => setForm(p => ({ ...p, jenis_mahar: e.target.value }))} 
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Nominal Uang Mahar (Rp)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-muted font-bold text-sm">Rp</span>
                                <input 
                                    type="number" 
                                    className="form-input pl-12" 
                                    placeholder="0"
                                    value={form.nominal_mahar || ''} 
                                    onChange={e => setForm(p => ({ ...p, nominal_mahar: e.target.value }))} 
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Barang Tambahan</label>
                            <textarea 
                                className="form-textarea" 
                                rows={2} 
                                placeholder="cth: Mukena, Sajadah, Al-Quran" 
                                value={form.barang_mahar || ''} 
                                onChange={e => setForm(p => ({ ...p, barang_mahar: e.target.value }))} 
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Penyajian</label>
                            <input 
                                className="form-input" 
                                placeholder="cth: Kotak mahar hias + kaligrafi" 
                                value={form.penyajian_mahar || ''} 
                                onChange={e => setForm(p => ({ ...p, penyajian_mahar: e.target.value }))} 
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="form-label text-xs">Vendor Hias</label>
                                <input 
                                    className="form-input" 
                                    placeholder="Nama vendor"
                                    value={form.vendor_mahar || ''} 
                                    onChange={e => setForm(p => ({ ...p, vendor_mahar: e.target.value }))} 
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label text-xs">Harga Jasa (Rp)</label>
                                <input 
                                    type="number" 
                                    className="form-input" 
                                    placeholder="0"
                                    value={form.harga_mahar || ''} 
                                    onChange={e => setForm(p => ({ ...p, harga_mahar: e.target.value }))} 
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Status Mahar</label>
                            <select 
                                className="form-select" 
                                value={form.status_mahar || 'Belum'} 
                                onChange={e => setForm(p => ({ ...p, status_mahar: e.target.value }))}
                            >
                                {['Belum', 'Proses Pengerjaan', 'Selesai'].map(v => <option key={v}>{v}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Cincin Section */}
                <div className="card">
                    <div className="p-6 border-b border-border bg-ivory/10 flex items-center gap-3">
                        <span className="text-2xl">💍</span>
                        <h2 className="font-playfair text-lg font-bold text-brown">Cincin Pernikahan</h2>
                    </div>
                    
                    <div className="p-6 space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="form-label text-xs">Ukuran Cincin 1</label>
                                <input 
                                    className="form-input" 
                                    placeholder="No. 14" 
                                    value={form.ukuran_cincin_1 || ''} 
                                    onChange={e => setForm(p => ({ ...p, ukuran_cincin_1: e.target.value }))} 
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label text-xs">Ukuran Cincin 2</label>
                                <input 
                                    className="form-input" 
                                    placeholder="No. 20" 
                                    value={form.ukuran_cincin_2 || ''} 
                                    onChange={e => setForm(p => ({ ...p, ukuran_cincin_2: e.target.value }))} 
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Bahan & Material</label>
                            <input 
                                className="form-input" 
                                placeholder="cth: Emas Putih 18K / Palladium" 
                                value={form.bahan_cincin || ''} 
                                onChange={e => setForm(p => ({ ...p, bahan_cincin: e.target.value }))} 
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Konsep Desain</label>
                            <input 
                                className="form-input" 
                                placeholder="cth: Polos dengan ukiran nama" 
                                value={form.desain_cincin || ''} 
                                onChange={e => setForm(p => ({ ...p, desain_cincin: e.target.value }))} 
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Vendor Perhiasan</label>
                            <input 
                                className="form-input" 
                                placeholder="Nama toko / pengrajin"
                                value={form.vendor_cincin || ''} 
                                onChange={e => setForm(p => ({ ...p, vendor_cincin: e.target.value }))} 
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="form-label text-xs">Harga Sepasang (Rp)</label>
                                <input 
                                    type="number" 
                                    className="form-input" 
                                    placeholder="0"
                                    value={form.harga_cincin || ''} 
                                    onChange={e => setForm(p => ({ ...p, harga_cincin: e.target.value }))} 
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label text-xs">Target Selesai / Ambil</label>
                                <input 
                                    type="date" 
                                    className="form-input" 
                                    value={form.tanggal_ambil || ''} 
                                    onChange={e => setForm(p => ({ ...p, tanggal_ambil: e.target.value }))} 
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Status Pesanan</label>
                            <select 
                                className="form-select" 
                                value={form.status_cincin || 'Belum'} 
                                onChange={e => setForm(p => ({ ...p, status_cincin: e.target.value }))}
                            >
                                {['Belum', 'Dipesan', 'Siap Diambil', 'Selesai'].map(v => <option key={v}>{v}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Checklist Section */}
            <div className="card">
                <div className="p-6 border-b border-border bg-ivory/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">📜</span>
                        <div>
                            <h2 className="font-playfair text-lg font-bold text-brown leading-tight">Checklist Perlengkapan Akad</h2>
                            <p className="text-xs text-brown-muted mt-0.5">Persiapan esensial untuk momen sakral</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs font-bold text-brown mb-1.5 uppercase tracking-wider">Progress Kesiapan</div>
                        <div className="flex items-center gap-3">
                            <div className="w-32 h-2 progress-track">
                                <div className="progress-fill" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-sm font-bold text-rose-gold min-w-[3rem]">{pct}%</span>
                        </div>
                    </div>
                </div>
                
                <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {AKAD_ITEMS.map(item => (
                            <label key={item} className="check-item group cursor-pointer border border-transparent hover:border-border transition-all">
                                <input 
                                    type="checkbox" 
                                    checked={!!checklist[item]} 
                                    onChange={() => setChecklist(p => ({ ...p, [item]: !p[item] }))} 
                                    className="form-checkbox"
                                />
                                <span className={`text-sm transition-all ${checklist[item] ? 'line-through text-brown-muted italic' : 'text-brown font-medium'}`}>
                                    {item}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Bottom Actions Mobile */}
            <div className="mt-8 lg:hidden flex gap-2">
                {data && (
                    <button className="btn-outline w-1/3 py-4 text-danger border-danger hover:bg-danger hover:text-white shadow-xl shadow-danger/10" onClick={handleReset} disabled={saving}>
                        Reset
                    </button>
                )}
                <button className={`btn-rose ${data ? 'w-2/3' : 'w-full'} py-4 shadow-xl shadow-rose-gold/30`} onClick={handleSave} disabled={saving}>
                    {saving ? 'Menyimpan...' : 'Simpan Semua'}
                </button>
            </div>
        </div>
    )
}