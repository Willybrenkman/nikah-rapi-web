// src/pages/BudgetPlanner.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useWedding } from '../hooks/useWedding'
import { confirmDelete } from '../lib/swal'
import toast from 'react-hot-toast'
import { syncService } from '../lib/syncService'
import { exportService } from '../lib/exportService'
import EmptyState from '../components/EmptyState'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'
import FileUpload from '../components/FileUpload'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const COLORS = ['#C9956C', '#E8C4B8', '#8BAF8B', '#D4756B', '#E8A87C', '#a0c4a0', '#d4b0a0', '#8090c0', '#c0a060', '#90b0d0', '#e0a0b0', '#b0c8b0']
const rp = (n = 0) => 'Rp ' + Number(n).toLocaleString('id-ID')

const EMPTY_FORM = { kategori: '', tipe: '', jumlah_estimasi: '', jumlah_aktual: '', catatan: '', file_url: '', payments: [] }

export default function BudgetPlanner() {
    const { wedding } = useWedding()
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [form, setForm] = useState(EMPTY_FORM)
    const [editId, setEditId] = useState(null)
    const [saving, setSaving] = useState(false)
    const [dbPayments, setDbPayments] = useState([])

    useEffect(() => { if (wedding) fetchItems() }, [wedding])

    const fetchItems = async () => {
        setLoading(true)
        if (wedding.id === 'dummy-wedding-id') {
            setItems([
                { id: 1, kategori: 'Gedung & Venue', tipe: 'venue', jumlah_estimasi: 25000000, jumlah_aktual: 25000000, catatan: 'Lunas', payments: [] },
                { id: 2, kategori: 'Katering (500 Pax)', tipe: 'katering', jumlah_estimasi: 45000000, jumlah_aktual: 20000000, catatan: 'Baru bayar DP 1', payments: [] },
                { id: 3, kategori: 'MUA & Kebaya', tipe: 'mua', jumlah_estimasi: 15000000, jumlah_aktual: 5000000, catatan: 'DP 10%', payments: [] },
                { id: 4, kategori: 'Dekorasi Pelaminan', tipe: 'dekorasi', jumlah_estimasi: 10000000, jumlah_aktual: 0, catatan: 'Belum bayar', payments: [] },
                { id: 5, kategori: 'Undangan Digital', tipe: 'undangan', jumlah_estimasi: 500000, jumlah_aktual: 500000, catatan: 'Lunas', payments: [] },
            ])
            setLoading(false)
            return
        }
        const { data } = await supabase.from('budget_items').select('*').eq('wedding_id', wedding.id).order('created_at')
        setItems(data || [])
        setLoading(false)
    }

    const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setModal(true) }
    const openEdit = async (item) => { 
        setForm({ 
            kategori: item.kategori, 
            tipe: item.tipe || '',
            jumlah_estimasi: item.jumlah_estimasi, 
            jumlah_aktual: item.jumlah_aktual || '', 
            catatan: item.catatan || '',
            file_url: item.file_url || '',
            payments: item.payments || []
        }); 
        setEditId(item.id); 
        setModal(true) 
        
        // Fetch real payments from DB
        const { data } = await supabase.from('budget_payments').select('*').eq('budget_item_id', item.id).order('payment_date', { ascending: false })
        setDbPayments(data || [])
    }

    const handleSave = async () => {
        if (!form.kategori) { toast.error('Nama kategori wajib diisi!'); return }
        
        const est = Number(form.jumlah_estimasi) || 0;
        const act = Number(form.jumlah_aktual) || 0;
        
        if (est < 0 || act < 0) {
            toast.error('Nominal dana tidak boleh minus!');
            return;
        }
        
        setSaving(true)
        
        try {
            const payload = { 
                kategori: form.kategori,
                tipe: form.tipe,
                jumlah_estimasi: est, 
                jumlah_aktual: act, 
                catatan: form.catatan,
                file_url: form.file_url,
                wedding_id: wedding.id 
            }

            if (editId) {
                await supabase.from('budget_items').update(payload).eq('id', editId)
            } else {
                await supabase.from('budget_items').insert(payload)
            }

            // --- CENTRALIZED AUTO-SYNC ---
            await syncService.syncFromBudget(
                wedding.id, 
                form.tipe, 
                form.kategori, 
                form.jumlah_estimasi, 
                form.jumlah_aktual
            )

            toast.success('Data Berhasil Disimpan & Disinkronkan! ✨')
            setModal(false)
            fetchItems()
        } catch (error) {
            console.error(error)
            toast.error('Gagal sinkronisasi data')
        } finally {
            setSaving(false)
        }
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

    const getIcon = (tipe, kategori = '') => {
        const t = tipe?.toLowerCase() || ''
        const k = kategori?.toLowerCase() || ''
        
        // 1. Cek berdasarkan tipe (Prioritas Utama)
        if (t === 'katering' || k.includes('katering') || k.includes('makan')) return '🍽️'
        if (t === 'mua' || k.includes('mua') || k.includes('rias') || k.includes('baju')) return '💄'
        if (t === 'venue' || k.includes('venue') || k.includes('gedung')) return '🏢'
        if (t === 'dekorasi' || k.includes('dekor')) return '🌸'
        if (t === 'foto' || k.includes('foto')) return '📸'
        if (t === 'video' || k.includes('video')) return '🎬'
        if (t === 'undangan' || k.includes('undangan')) return '💌'
        if (t === 'souvenir' || k.includes('souvenir')) return '🎁'
        if (t === 'seserahan' || k.includes('seserahan') || k.includes('hantaran')) return '🛍️'
        if (t === 'honeymoon' || k.includes('honeymoon')) return '✈️'
        if (t === 'hiburan' || k.includes('musik') || k.includes('hiburan')) return '🎸'
        if (t === 'lainnya') return '📦'
        
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
                <div className="flex gap-2">
                    {items.length > 0 && (
                        <button className="btn-outline px-4 flex items-center gap-2 text-sm" onClick={() => exportService.exportBudget(items, wedding?.total_budget)}>
                            📥 Excel
                        </button>
                    )}
                    <button className="btn-rose px-8 shadow-lg shadow-rose-gold/20 flex items-center gap-2" onClick={openAdd}>
                        <span>+</span> Tambah Kategori Budget
                    </button>
                </div>
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
                        {items.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-brown-muted text-sm italic">Belum ada data anggaran</div>
                        ) : (
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
                        )}
                    </div>
                </div>
                <div className="card lg:col-span-3 shadow-sm border-ivory/50">
                    <div className="p-6 border-b border-border bg-ivory/5 flex justify-between items-center">
                        <h2 className="font-playfair text-lg font-bold text-brown">Komparasi Estimasi vs Aktual</h2>
                        <span className="text-[10px] font-bold text-brown-muted uppercase tracking-widest italic">Top 8 Kategori Utama</span>
                    </div>
                    <div className="p-8 h-[340px]">
                        {items.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-brown-muted text-sm italic">Belum ada data anggaran</div>
                        ) : (
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
                        )}
                    </div>
                </div>
            </div>

            <div className="card p-0 overflow-hidden group/table shadow-sm border-ivory/50">
                <div className="p-6 border-b border-border flex justify-between items-center bg-ivory/5">
                    <h2 className="font-playfair text-xl font-bold text-brown">Rincian Pengeluaran Terperinci</h2>
                    <span className="text-[10px] font-bold text-brown-muted uppercase tracking-widest italic">{items.length} Kategori Anggaran</span>
                </div>
                
                {items.length === 0 ? (
                    <EmptyState 
                        icon="💰"
                        title="Belum ada rencana budget"
                        subtitle="Mulai susun rencana keuangan pernikahanmu dengan menekan tombol 'Tambah Kategori Budget' di pojok kanan atas."
                    />
                ) : (
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
                                {items.map((item, i) => {
                                    const sel = (item.jumlah_estimasi || 0) - (item.jumlah_aktual || 0)
                                    const pct = item.jumlah_estimasi > 0 ? Math.min(100, Math.round((item.jumlah_aktual || 0) / item.jumlah_estimasi * 100)) : 0
                                    const badge = item.jumlah_aktual === 0 ? 'badge-grey' : pct >= 100 ? 'badge-green' : pct > 70 ? 'badge-yellow' : 'badge-red'
                                    const blabel = item.jumlah_aktual === 0 ? 'Belum Bayar' : pct >= 100 ? 'Lunas Total' : pct > 70 ? 'Hampir Lunas' : 'Bayar Sebagian'
                                    return (
                                        <tr key={item.id} className="tr group transition-all hover:bg-ivory/10">
                                            <td className="td text-center text-[10px] text-brown-muted font-black tracking-widest">{String(i + 1).padStart(2, '0')}</td>
                                            <td className="td">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-ivory/50 flex items-center justify-center text-xl shadow-inner-white">{getIcon(item.tipe, item.kategori)}</div>
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
                                                    <button className="btn-sm-edit shadow-sm flex items-center gap-1" onClick={() => openEdit(item)}>
                                                        <span>✏️</span> Edit
                                                    </button>
                                                    <button className="btn-sm-danger p-1 shadow-sm" onClick={() => handleDelete(item.id)}>✕</button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {modal && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
                    <div className="modal-box max-w-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="font-playfair text-2xl font-bold text-brown">
                                    {editId ? 'Detail & Kelola' : 'Tambah'} Anggaran
                                </h2>
                                <div className="flex gap-4 mt-3">
                                    <button 
                                        className={`pb-2 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${!form.viewTab || form.viewTab === 'info' ? 'border-rose-gold text-brown' : 'border-transparent text-brown-muted'}`}
                                        onClick={() => setForm(p => ({ ...p, viewTab: 'info' }))}
                                    >
                                        1. Informasi Utama
                                    </button>
                                    {editId && (
                                        <button 
                                            className={`pb-2 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${form.viewTab === 'payment' ? 'border-rose-gold text-brown' : 'border-transparent text-brown-muted'}`}
                                            onClick={() => setForm(p => ({ ...p, viewTab: 'payment' }))}
                                        >
                                            2. Pembayaran & Dokumen
                                        </button>
                                    )}
                                </div>
                            </div>
                            <button onClick={() => setModal(false)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-ivory text-brown-muted transition-colors">✕</button>
                        </div>
                        
                        {(!form.viewTab || form.viewTab === 'info') ? (
                            <div className="space-y-5 animate-fade-in">
                                <div className="form-group">
                                    <label className="form-label text-rose-gold font-black">Pilih Tipe Kategori (Untuk Sinkronisasi)</label>
                                    <select className="form-select" value={form.tipe} onChange={e => setForm(p => ({ ...p, tipe: e.target.value }))}>
                                        <option value="">Tidak ada sinkronisasi</option>
                                        <option value="katering">🍽️ Katering & Menu</option>
                                        <option value="mua">💄 MUA & Busana</option>
                                        <option value="venue">🏢 Venue / Lokasi</option>
                                        <option value="dekorasi">🌸 Dekorasi & Tema</option>
                                        <option value="foto">📸 Fotografer</option>
                                        <option value="video">🎬 Videografer</option>
                                        <option value="undangan">💌 Undangan & Desain</option>
                                        <option value="souvenir">🎁 Souvenir & Hampers</option>
                                        <option value="seserahan">🛍️ Seserahan</option>
                                        <option value="honeymoon">✈️ Honeymoon</option>
                                        <option value="hiburan">🎸 Hiburan / Musik</option>
                                        <option value="lainnya">📦 Lain-lain</option>
                                    </select>
                                </div>
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
                                    <textarea className="form-textarea shadow-inner-white" rows={3} placeholder="Masukkan rincian tambahan..."
                                        value={form.catatan} onChange={e => setForm(p => ({ ...p, catatan: e.target.value }))} />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-fade-in">
                                <div className="bg-ivory/30 p-5 rounded-2xl border border-ivory">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-brown mb-4 flex items-center gap-2">
                                        <span>📁</span> Dokumen & Kontrak
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {form.file_url && (
                                            <a href={form.file_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-rose-gold/30 text-[11px] font-bold text-rose-dark shadow-sm">
                                                <span>📄</span> Lihat Dokumen
                                            </a>
                                        )}
                                        <FileUpload 
                                            weddingId={wedding.id} 
                                            folder="budget" 
                                            onUploadComplete={(url) => setForm(p => ({ ...p, file_url: url }))} 
                                        />
                                    </div>
                                </div>

                                <div className="bg-ivory/30 p-5 rounded-2xl border border-ivory">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-brown mb-4 flex items-center justify-center gap-2">
                                        <span>📑</span> Histori Pembayaran
                                    </h3>
                                    <div className="space-y-3 mb-6">
                                        {dbPayments.length === 0 ? (
                                            <p className="text-[10px] text-brown-muted italic text-center py-4">Belum ada riwayat pembayaran tercatat di database.</p>
                                        ) : (
                                            dbPayments.map((p, idx) => (
                                                <div key={p.id || idx} className="flex justify-between items-center text-[11px] p-3 bg-white rounded-xl border border-border shadow-sm group/pay">
                                                    <div>
                                                        <div className="font-bold text-brown">{p.description || 'Pembayaran'}</div>
                                                        <div className="text-[9px] text-brown-muted italic">{p.payment_date}</div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="font-black text-sage">{rp(p.amount)}</div>
                                                        <button 
                                                            className="text-danger hover:text-danger/70 transition-colors p-1"
                                                            onClick={async () => { 
                                                                const res = await confirmDelete('Hapus riwayat bayar ini?')
                                                                if(!res.isConfirmed) return; 
                                                                await supabase.from('budget_payments').delete().eq('id', p.id)
                                                                const { data } = await supabase.from('budget_payments').select('*').eq('budget_item_id', editId).order('payment_date', { ascending: false })
                                                                setDbPayments(data || [])
                                                                // Update total aktual di UI
                                                                const newTotal = (data || []).reduce((acc, curr) => acc + Number(curr.amount), 0)
                                                                setForm(prev => ({ ...prev, jumlah_aktual: newTotal }))
                                                            }}
                                                            title="Hapus Pembayaran"
                                                        >✕</button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    
                                    <div className="p-4 bg-white/50 rounded-xl border border-dashed border-rose-gold/30">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-brown-muted mb-3">Tambah Riwayat Bayar (Langsung Simpan)</p>
                                        <div className="grid grid-cols-2 gap-2 mb-2">
                                            <input type="text" id="pay_ket" placeholder="Keterangan (cth: DP 1)" className="text-[10px] p-2 rounded-lg border border-border outline-none focus:border-rose-gold" />
                                            <input type="number" id="pay_amt" placeholder="Nominal Rp" className="text-[10px] p-2 rounded-lg border border-border outline-none focus:border-rose-gold" />
                                        </div>
                                        <button 
                                            onClick={async () => {
                                                const k = document.getElementById('pay_ket').value
                                                const a = document.getElementById('pay_amt').value
                                                if (!k || !a) return toast.error('Isi ket & nominal!')
                                                
                                                setSaving(true)
                                                try {
                                                    const newPay = { 
                                                        budget_item_id: editId,
                                                        wedding_id: wedding.id,
                                                        description: k, 
                                                        amount: Number(a), 
                                                        payment_date: new Date().toISOString().split('T')[0] 
                                                    }
                                                    
                                                    const { error } = await supabase.from('budget_payments').insert(newPay)
                                                    if (error) throw error

                                                    // Refresh list
                                                    const { data } = await supabase.from('budget_payments').select('*').eq('budget_item_id', editId).order('payment_date', { ascending: false })
                                                    setDbPayments(data || [])
                                                    
                                                    // Update total aktual di form & items
                                                    const newTotal = (data || []).reduce((acc, curr) => acc + Number(curr.amount), 0)
                                                    setForm(p => ({ ...p, jumlah_aktual: newTotal }))
                                                    
                                                    toast.success('Pembayaran tercatat! ✨')
                                                    document.getElementById('pay_ket').value = ''
                                                    document.getElementById('pay_amt').value = ''
                                                } catch (err) {
                                                    console.error(err)
                                                    toast.error('Gagal mencatat pembayaran')
                                                } finally {
                                                    setSaving(false)
                                                }
                                            }}
                                            className="w-full py-2 bg-rose-gold text-white text-[10px] font-black rounded-lg shadow-md hover:bg-rose-dark transition-all uppercase tracking-widest"
                                        >
                                            Simpan ke Database
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4 justify-end mt-10 pt-8 border-t border-border">
                            <button className="btn-outline px-8 py-3 text-xs font-bold uppercase tracking-widest" onClick={() => setModal(false)}>Batal</button>
                            <button className="btn-rose px-10 py-3 text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-gold/20" onClick={handleSave} disabled={saving}>
                                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}