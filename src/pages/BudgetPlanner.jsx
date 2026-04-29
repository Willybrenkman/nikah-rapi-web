// src/pages/BudgetPlanner.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useWedding } from '../hooks/useWedding'
import { confirmDelete } from '../lib/swal'
import toast from 'react-hot-toast'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const COLORS = ['#C9956C', '#E8C4B8', '#8BAF8B', '#D4756B', '#E8A87C', '#a0c4a0', '#d4b0a0', '#8090c0', '#c0a060', '#90b0d0', '#e0a0b0', '#b0c8b0']
const rp = (n = 0) => 'Rp ' + Number(n).toLocaleString('id-ID')

const EMPTY_FORM = { kategori: '', jumlah_estimasi: '', jumlah_aktual: '', catatan: '' }

export default function BudgetPlanner() {
    const { wedding } = useWedding()
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [form, setForm] = useState(EMPTY_FORM)
    const [editId, setEditId] = useState(null)
    const [saving, setSaving] = useState(false)

    useEffect(() => { if (wedding) fetchItems() }, [wedding])

    const fetchItems = async () => {
        setLoading(true)
        const { data } = await supabase.from('budget_items').select('*').eq('wedding_id', wedding.id).order('created_at')
        setItems(data || [])
        setLoading(false)
    }

    const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setModal(true) }
    const openEdit = (item) => { setForm({ kategori: item.kategori, jumlah_estimasi: item.jumlah_estimasi, jumlah_aktual: item.jumlah_aktual || '', catatan: item.catatan || '' }); setEditId(item.id); setModal(true) }

    const handleSave = async () => {
        if (!form.kategori) { toast.error('Nama kategori wajib diisi!'); return }
        setSaving(true)
        const payload = { ...form, jumlah_estimasi: Number(form.jumlah_estimasi) || 0, jumlah_aktual: Number(form.jumlah_aktual) || 0, wedding_id: wedding.id }
        if (editId) {
            await supabase.from('budget_items').update(payload).eq('id', editId)
            toast.success('Budget diperbarui!')
        } else {
            await supabase.from('budget_items').insert(payload)
            toast.success('Budget ditambahkan!')
        }
        setModal(false)
        fetchItems()
        setSaving(false)
    }

    const handleDelete = async (id) => {
        const result = await confirmDelete('Hapus anggaran ini?', 'Data pengeluaran ini akan dihapus dari rencana budget.')
        if (!result.isConfirmed) return
        
        await supabase.from('budget_items').delete().eq('id', id)
        toast.success('Dihapus!')
        fetchItems()
    }

    const totalEst = items.reduce((a, i) => a + (i.jumlah_estimasi || 0), 0)
    const totalReal = items.reduce((a, i) => a + (i.jumlah_aktual || 0), 0)
    const sisa = totalEst - totalReal

    const getCatIcon = (cat) => {
        const c = cat.toLowerCase()
        if (c.includes('venue')) return '🏢'
        if (c.includes('katering') || c.includes('makan')) return '🍱'
        if (c.includes('dekor')) return '🌸'
        if (c.includes('foto') || c.includes('video')) return '📸'
        if (c.includes('mua') || c.includes('baju') || c.includes('busana')) return '👗'
        if (c.includes('undangan')) return '💌'
        if (c.includes('souvenir')) return '🎁'
        return '💰'
    }

    if (loading && items.length === 0) return <div className="text-center py-20 text-brown-muted font-playfair italic">Menganalisa rincian anggaran pernikahanmu...</div>

    return (
        <div className="animate-fade-in pb-12">
            <div className="section-header">
                <div>
                    <h1 className="section-title">Perencana Anggaran 💰</h1>
                    <p className="section-subtitle">Pantau rencana estimasi dan realisasi pengeluaran pernikahan kalian</p>
                </div>
                <button className="btn-rose px-8 shadow-lg shadow-rose-gold/20 flex items-center gap-2" onClick={openAdd}>
                    <span>+</span> Tambah Kategori Budget
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="stat-card hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="w-12 h-12 rounded-2xl bg-rose-gold/10 flex items-center justify-center text-xl mb-4">📋</div>
                    <div className="font-playfair text-2xl font-bold text-brown leading-tight">{rp(totalEst)}</div>
                    <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Total Estimasi Awal</div>
                </div>
                <div className="stat-card hover:shadow-xl transition-all hover:-translate-y-1 border-danger/10 shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-danger/5 flex items-center justify-center text-xl mb-4">💸</div>
                    <div className="font-playfair text-2xl font-bold text-brown leading-tight">{rp(totalReal)}</div>
                    <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Total Realisasi Dana</div>
                </div>
                <div className="stat-card hover:shadow-xl transition-all hover:-translate-y-1 border-sage/20 shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-sage/10 flex items-center justify-center text-xl mb-4">✨</div>
                    <div className="font-playfair text-2xl font-bold text-brown leading-tight">{rp(sisa)}</div>
                    <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Sisa Anggaran (Efisiensi)</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
                <div className="card lg:col-span-2 shadow-sm border-ivory/50">
                    <div className="p-6 border-b border-border bg-ivory/5">
                        <h2 className="font-playfair text-lg font-bold text-brown">Alokasi Dana per Kategori</h2>
                    </div>
                    <div className="p-8 h-[340px]">
                        <Pie 
                            data={{ 
                                labels: items.map(i => i.kategori), 
                                datasets: [{ 
                                    data: items.map(i => i.jumlah_estimasi || 0), 
                                    backgroundColor: COLORS, 
                                    borderWidth: 0,
                                    hoverOffset: 20
                                }] 
                            }}
                            options={{ 
                                responsive: true, 
                                maintainAspectRatio: false, 
                                plugins: { 
                                    legend: { 
                                        position: 'bottom', 
                                        labels: { 
                                            font: { size: 10, family: "'DM Sans', sans-serif", weight: '700' }, 
                                            usePointStyle: true,
                                            padding: 25,
                                            boxWidth: 8
                                        } 
                                    },
                                    tooltip: {
                                        backgroundColor: '#2C1810',
                                        titleFont: { size: 12, family: 'Playfair Display' },
                                        padding: 12,
                                        cornerRadius: 12
                                    }
                                } 
                            }} 
                        />
                    </div>
                </div>
                <div className="card lg:col-span-3 shadow-sm border-ivory/50">
                    <div className="p-6 border-b border-border bg-ivory/5 flex justify-between items-center">
                        <h2 className="font-playfair text-lg font-bold text-brown">Komparasi Estimasi vs Aktual</h2>
                        <span className="text-[10px] font-bold text-brown-muted uppercase tracking-widest italic">Top 8 Kategori Utama</span>
                    </div>
                    <div className="p-8 h-[340px]">
                        <Bar 
                            data={{
                                labels: items.slice(0, 8).map(i => i.kategori),
                                datasets: [
                                    { label: 'Estimasi Dana', data: items.slice(0, 8).map(i => i.jumlah_estimasi || 0), backgroundColor: '#C9956C80', borderRadius: 6, barThickness: 16 },
                                    { label: 'Realisasi Aktual', data: items.slice(0, 8).map(i => i.jumlah_aktual || 0), backgroundColor: '#8BAF8BCC', borderRadius: 6, barThickness: 16 },
                                ]
                            }} 
                            options={{ 
                                responsive: true, 
                                maintainAspectRatio: false, 
                                plugins: { 
                                    legend: { 
                                        position: 'bottom',
                                        labels: { 
                                            font: { size: 10, family: "'DM Sans', sans-serif", weight: '700' }, 
                                            usePointStyle: true,
                                            padding: 25,
                                            boxWidth: 8
                                        } 
                                    },
                                    tooltip: {
                                        backgroundColor: '#2C1810',
                                        padding: 12,
                                        cornerRadius: 12
                                    }
                                }, 
                                scales: { 
                                    y: { 
                                        beginAtZero: true, 
                                        grid: { color: '#F0E6DF', drawBorder: false }, 
                                        ticks: { font: { size: 9, weight: '500' }, color: '#826A5E' } 
                                    }, 
                                    x: { 
                                        grid: { display: false }, 
                                        ticks: { font: { size: 9, weight: '700' }, color: '#5C4033' } 
                                    } 
                                } 
                            }} 
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="card p-0 overflow-hidden group/table shadow-sm border-ivory/50">
                <div className="p-6 border-b border-border flex justify-between items-center bg-ivory/5">
                    <h2 className="font-playfair text-xl font-bold text-brown">Rincian Pengeluaran Terperinci</h2>
                    <span className="text-[10px] font-bold text-brown-muted uppercase tracking-widest italic">{items.length} Kategori Anggaran</span>
                </div>
                <div className="overflow-x-auto">
                    <table>
                        <thead>
                            <tr>
                                <th className="th w-12 text-center">No</th>
                                <th className="th">Kategori Anggaran</th>
                                <th className="th">Dana Estimasi</th>
                                <th className="th">Dana Aktual</th>
                                <th className="th">Selisih/Efisiensi</th>
                                <th className="th">Progres Dana</th>
                                <th className="th">Status Pembayaran</th>
                                <th className="th text-right pr-8">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr><td colSpan={8} className="td text-center py-24 text-brown-muted italic font-medium">Belum ada item anggaran terdaftar. Mari buat rencana keuangan yang rapi!</td></tr>
                            ) : items.map((item, i) => {
                                const sel = (item.jumlah_estimasi || 0) - (item.jumlah_aktual || 0)
                                const pct = item.jumlah_estimasi > 0 ? Math.min(100, Math.round((item.jumlah_aktual || 0) / item.jumlah_estimasi * 100)) : 0
                                const badge = item.jumlah_aktual === 0 ? 'badge-grey' : pct >= 100 ? 'badge-green' : pct > 70 ? 'badge-yellow' : 'badge-red'
                                const blabel = item.jumlah_aktual === 0 ? 'Belum Bayar' : pct >= 100 ? 'Lunas Total' : pct > 70 ? 'Hampir Lunas' : 'Bayar Sebagian'
                                return (
                                    <tr key={item.id} className="tr group transition-all hover:bg-ivory/10">
                                        <td className="td text-center text-[10px] text-brown-muted font-black tracking-widest">{String(i + 1).padStart(2, '0')}</td>
                                        <td className="td">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-ivory/50 flex items-center justify-center text-xl shadow-inner-white">{getCatIcon(item.kategori)}</div>
                                                <span className="font-bold text-brown group-hover:text-rose-gold transition-colors">{item.kategori}</span>
                                            </div>
                                        </td>
                                        <td className="td text-[11px] font-bold text-brown-muted">{rp(item.jumlah_estimasi)}</td>
                                        <td className="td text-[11px] font-black text-brown">{rp(item.jumlah_aktual)}</td>
                                        <td className={`td text-[11px] font-black ${sel >= 0 ? 'text-sage bg-sage/5' : 'text-danger bg-danger/5'} px-3 rounded-lg`}>
                                            {sel >= 0 ? '+' : ''}{rp(Math.abs(sel))}
                                        </td>
                                        <td className="td min-w-[140px]">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 progress-track h-2 bg-ivory relative overflow-hidden rounded-full">
                                                    <div className="progress-fill shadow-sm h-full" style={{ width: `${pct}%` }} />
                                                </div>
                                                <span className="text-[10px] font-black text-brown-muted min-w-[2rem]">{pct}%</span>
                                            </div>
                                        </td>
                                        <td className="td">
                                            <span className={`badge ${badge} text-[9px] font-black uppercase tracking-tighter`}>
                                                {blabel}
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
                    <div className="modal-box max-w-md">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="font-playfair text-2xl font-bold text-brown">
                                    {editId ? 'Edit' : 'Tambah'} Anggaran
                                </h2>
                                <p className="text-[10px] font-bold text-brown-muted uppercase tracking-widest mt-1">Detail alokasi dana pernikahan</p>
                            </div>
                            <button onClick={() => setModal(false)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-ivory text-brown-muted transition-colors">✕</button>
                        </div>
                        
                        <div className="space-y-5">
                            <div className="form-group">
                                <label className="form-label">Nama Kategori Anggaran</label>
                                <input className="form-input shadow-inner-white" placeholder="cth: DP Venue, Katering Utama, Sewa Baju..." 
                                    value={form.kategori} onChange={e => setForm(p => ({ ...p, kategori: e.target.value }))} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label">Dana Estimasi (Rp)</label>
                                    <input type="number" className="form-input shadow-inner-white" placeholder="0"
                                        value={form.jumlah_estimasi} onChange={e => setForm(p => ({ ...p, jumlah_estimasi: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Dana Realisasi/Aktual (Rp)</label>
                                    <input type="number" className="form-input shadow-inner-white" placeholder="0"
                                        value={form.jumlah_aktual} onChange={e => setForm(p => ({ ...p, jumlah_aktual: e.target.value }))} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Catatan Tambahan</label>
                                <textarea className="form-textarea shadow-inner-white" rows={3} placeholder="Masukkan rincian tambahan atau termin pembayaran..."
                                    value={form.catatan} onChange={e => setForm(p => ({ ...p, catatan: e.target.value }))} />
                            </div>
                        </div>

                        <div className="flex gap-4 justify-end mt-10 pt-8 border-t border-border">
                            <button className="btn-outline px-8 py-3 text-xs font-bold uppercase tracking-widest" onClick={() => setModal(false)}>Batal</button>
                            <button className="btn-rose px-10 py-3 text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-gold/20" onClick={handleSave} disabled={saving}>
                                {saving ? 'Menyimpan...' : 'Simpan Data Anggaran'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}