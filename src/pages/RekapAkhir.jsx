// src/pages/RekapAkhir.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useWedding } from '../hooks/useWedding'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import toast from 'react-hot-toast'
import { exportService } from '../lib/exportService'
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const rp = (n = 0) => 'Rp ' + Number(n).toLocaleString('id-ID')

export default function RekapAkhir() {
    const { wedding, hMin } = useWedding()
    const [stats, setStats] = useState({ totalBudget: 0, usedBudget: 0, totalTamu: 0, tamuHadir: 0, totalVendor: 0, totalSeserahan: 0, totalAngpao: 0, angpaoPemberi: 0, checklistDone: 0, checklistTotal: 0 })
    const [budgetItems, setBudgetItems] = useState([])
    const [kesan, setKesan] = useState('')
    const [loading, setLoading] = useState(true)
    const [exporting, setExporting] = useState(false)

    useEffect(() => { if (wedding) fetchData() }, [wedding])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [budgetRes, tamuRes, vendorRes, sesRes, angpaoRes, checkRes] = await Promise.all([
                supabase.from('budget_items').select('*').eq('wedding_id', wedding.id),
                supabase.from('tamu_undangan').select('status_rsvp').eq('wedding_id', wedding.id),
                supabase.from('vendors').select('id').eq('wedding_id', wedding.id),
                supabase.from('seserahan_items').select('id').eq('wedding_id', wedding.id),
                supabase.from('kado_angpao').select('nominal,jenis').eq('wedding_id', wedding.id),
                supabase.from('checklist_items').select('is_done').eq('wedding_id', wedding.id),
            ])
            const items = budgetRes.data || []
            const tamu = tamuRes.data || []
            const angpao = angpaoRes.data || []
            const checks = checkRes.data || []
            setBudgetItems(items)
            setStats({
                totalBudget: wedding.total_budget || 0,
                usedBudget: items.reduce((a, i) => a + (i.jumlah_aktual || 0), 0),
                totalTamu: tamu.length,
                tamuHadir: tamu.filter(t => t.status_rsvp === 'hadir').length,
                totalVendor: (vendorRes.data || []).length,
                totalSeserahan: (sesRes.data || []).length,
                totalAngpao: angpao.filter(a => a.jenis === 'Angpao' || a.jenis === 'Keduanya').reduce((a, i) => a + (i.nominal || 0), 0),
                angpaoPemberi: angpao.length,
                checklistDone: checks.filter(c => c.is_done).length,
                checklistTotal: checks.length,
            })
        } catch (err) { console.error(err) }
        finally { setLoading(false) }
    }

    const sisa = stats.totalBudget - stats.usedBudget
    const chkPct = stats.checklistTotal > 0 ? Math.round(stats.checklistDone / stats.checklistTotal * 100) : 0

    const barData = {
        labels: budgetItems.map(i => i.kategori || i.nama || 'Item'),
        datasets: [
            { label: 'Estimasi (Jt)', data: budgetItems.map(i => +((i.jumlah_estimasi || 0) / 1e6).toFixed(1)), backgroundColor: '#C9956C80', borderRadius: 8 },
            { label: 'Aktual (Jt)', data: budgetItems.map(i => +((i.jumlah_aktual || 0) / 1e6).toFixed(1)), backgroundColor: '#8BAF8BCC', borderRadius: 8 },
        ]
    }

    const handleExportAll = async () => {
        setExporting(true)
        try {
            const [bRes, gRes, vRes, sRes, aRes, cRes, tRes] = await Promise.all([
                supabase.from('budget_items').select('*').eq('wedding_id', wedding.id),
                supabase.from('tamu_undangan').select('*').eq('wedding_id', wedding.id).order('nama'),
                supabase.from('vendors').select('*').eq('wedding_id', wedding.id),
                supabase.from('seserahan_items').select('*').eq('wedding_id', wedding.id),
                supabase.from('kado_angpao').select('*').eq('wedding_id', wedding.id),
                supabase.from('checklist_items').select('*').eq('wedding_id', wedding.id),
                supabase.from('timeline_events').select('*').eq('wedding_id', wedding.id).order('waktu'),
            ])
            exportService.exportRekapLengkap({
                budget: bRes.data || [],
                guests: gRes.data || [],
                vendors: vRes.data || [],
                seserahan: sRes.data || [],
                angpao: aRes.data || [],
                checklist: cRes.data || [],
                timeline: tRes.data || [],
                weddingProfile: wedding,
            })
            toast.success('File Excel berhasil diunduh! 📥')
        } catch (err) {
            console.error(err)
            toast.error('Gagal mengekspor data')
        } finally {
            setExporting(false)
        }
    }

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <div className="text-5xl animate-bounce-slow">📊</div>
            <p className="text-brown-muted font-playfair italic">Meyusun laporan rekapitulasi...</p>
        </div>
    )

    return (
        <div className="animate-fade-in pb-12">
            <div className="section-header">
                <div>
                    <h1 className="section-title">Rekap Akhir 📋</h1>
                    <p className="section-subtitle">Ringkasan lengkap perjalanan persiapan hari bahagia kalian</p>
                </div>
                <button 
                    className="btn-rose px-8 shadow-lg shadow-rose-gold/20 flex items-center gap-2" 
                    onClick={handleExportAll}
                    disabled={exporting}
                >
                    {exporting ? (
                        <><span className="animate-spin">⏳</span> Mengunduh...</>
                    ) : (
                        <><span>📥</span> Download Rekap Excel</>
                    )}
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="stat-card hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="w-12 h-12 rounded-2xl bg-rose-gold/10 flex items-center justify-center text-xl mb-4">💎</div>
                    <div className="font-playfair text-2xl font-bold text-brown leading-tight">{rp(stats.totalBudget)}</div>
                    <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Anggaran Direncanakan</div>
                </div>
                <div className="stat-card hover:shadow-xl transition-all hover:-translate-y-1 border-rose-gold/20">
                    <div className="w-12 h-12 rounded-2xl bg-danger/5 flex items-center justify-center text-xl mb-4">💸</div>
                    <div className="font-playfair text-2xl font-bold text-brown leading-tight">{rp(stats.usedBudget)}</div>
                    <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Total Realisasi Dana</div>
                </div>
                <div className="stat-card hover:shadow-xl transition-all hover:-translate-y-1 border-sage/20">
                    <div className="w-12 h-12 rounded-2xl bg-sage/10 flex items-center justify-center text-xl mb-4">🍃</div>
                    <div className="font-playfair text-2xl font-bold text-brown leading-tight">{rp(sisa)}</div>
                    <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Sisa Anggaran (Efisiensi)</div>
                </div>
            </div>

            {/* Chart */}
            {budgetItems.length > 0 && (
                <div className="card mb-10 overflow-hidden group shadow-sm border-ivory/50">
                    <div className="p-6 border-b border-border flex justify-between items-center bg-ivory/10">
                        <h2 className="font-playfair text-xl font-bold text-brown">Evaluasi Penggunaan Dana per Kategori</h2>
                        <span className="text-[10px] font-bold text-brown-muted uppercase tracking-widest">Estimasi vs Aktual</span>
                    </div>
                    <div className="p-8 h-[380px]">
                        <Bar 
                            data={barData} 
                            options={{ 
                                responsive: true, 
                                maintainAspectRatio: false, 
                                plugins: { 
                                    legend: { 
                                        position: 'bottom',
                                        labels: { 
                                            font: { size: 10, family: "'DM Sans', sans-serif", weight: '700' },
                                            usePointStyle: true,
                                            padding: 30,
                                            boxWidth: 8
                                        } 
                                    },
                                    tooltip: {
                                        backgroundColor: '#2C1810',
                                        titleFont: { size: 12, family: 'Playfair Display' },
                                        padding: 12,
                                        cornerRadius: 12
                                    }
                                }, 
                                scales: { 
                                    y: { 
                                        beginAtZero: true, 
                                        grid: { color: '#F0E6DF', drawBorder: false },
                                        ticks: { font: { size: 10, weight: '500' }, color: '#826A5E' }
                                    }, 
                                    x: { 
                                        grid: { display: false }, 
                                        ticks: { font: { size: 10, weight: '700' }, color: '#5C4033' } 
                                    } 
                                } 
                            }} 
                        />
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Statistik Lengkap */}
                <div className="card lg:col-span-2 h-full shadow-sm border-ivory/50">
                    <div className="p-6 border-b border-border mb-4 flex items-center justify-between bg-ivory/5">
                        <h2 className="font-playfair text-xl font-bold text-brown">Statistik Final ✨</h2>
                        <span className="text-[10px] font-black text-rose-gold uppercase tracking-tighter bg-rose-gold/5 px-2 py-1 rounded">Update Real-time</span>
                    </div>
                    <div className="px-2 space-y-1">
                        <div className="summary-row px-5 py-4 hover:bg-ivory/30 rounded-xl transition-colors border-b border-ivory/50 last:border-0">
                            <span className="text-sm font-medium text-brown-muted">Total Tamu Undangan</span>
                            <span className="font-bold text-brown bg-ivory/50 border border-border/50 px-3 py-1 rounded-full text-[11px]">{stats.totalTamu} Undangan</span>
                        </div>
                        <div className="summary-row px-5 py-4 hover:bg-ivory/30 rounded-xl transition-colors border-b border-ivory/50 last:border-0">
                            <span className="text-sm font-medium text-brown-muted">Konfirmasi Hadir (RSVP)</span>
                            <span className="font-bold text-sage bg-sage/5 border border-sage/10 px-3 py-1 rounded-full text-[11px]">{stats.tamuHadir} Orang</span>
                        </div>
                        <div className="summary-row px-5 py-4 hover:bg-ivory/30 rounded-xl transition-colors border-b border-ivory/50 last:border-0">
                            <span className="text-sm font-medium text-brown-muted">Partner Vendor Terlibat</span>
                            <span className="font-bold text-brown bg-ivory/50 border border-border/50 px-3 py-1 rounded-full text-[11px]">{stats.totalVendor} Vendor</span>
                        </div>
                        <div className="summary-row px-5 py-4 hover:bg-ivory/30 rounded-xl transition-colors border-b border-ivory/50 last:border-0">
                            <span className="text-sm font-medium text-brown-muted">Item Boxes Seserahan</span>
                            <span className="font-bold text-brown bg-ivory/50 border border-border/50 px-3 py-1 rounded-full text-[11px]">{stats.totalSeserahan} Boxes</span>
                        </div>
                        <div className="summary-row px-5 py-4 hover:bg-ivory/30 rounded-xl transition-colors border-b border-ivory/50 last:border-0">
                            <span className="text-sm font-medium text-brown-muted">Total Pemberi Kado/Angpao</span>
                            <span className="font-bold text-brown bg-ivory/50 border border-border/50 px-3 py-1 rounded-full text-[11px]">{stats.angpaoPemberi} Orang</span>
                        </div>
                        <div className="px-5 py-6 bg-gradient-to-br from-rose-gold/5 to-ivory/20 rounded-2xl border border-rose-gold/10 my-4 shadow-inner">
                            <div className="text-[10px] font-black text-rose-gold uppercase tracking-[0.2em] mb-2 text-center">Total Angpao Diterima</div>
                            <div className="font-playfair text-3xl font-black text-brown text-center leading-none">{rp(stats.totalAngpao)}</div>
                        </div>
                        <div className="summary-row px-5 py-4 bg-ivory/20 rounded-xl border border-border/50">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-brown">Progres Persiapan</span>
                                <span className="text-[10px] text-brown-muted uppercase tracking-widest mt-0.5">{stats.checklistDone} dari {stats.checklistTotal} Tugas Selesai</span>
                            </div>
                            <div className="text-right">
                                <div className="font-playfair text-2xl font-black text-rose-gold">{chkPct}%</div>
                            </div>
                        </div>
                    </div>
                    {hMin !== null && (
                        <div className="m-4 mt-8 p-8 bg-gradient-to-br from-brown-main to-[#1a0f0a] rounded-3xl text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 transform group-hover:rotate-45 transition-transform duration-1000">💍</div>
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <div className="text-[10px] opacity-60 uppercase tracking-[0.3em] font-black mb-2">Countdown</div>
                                    <div className="text-xl font-playfair font-bold">Menuju Hari Bahagia</div>
                                </div>
                                <div className="text-5xl font-playfair font-black tracking-tighter drop-shadow-lg">H-{hMin}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Kenangan */}
                <div className="card lg:col-span-3 h-full flex flex-col shadow-sm border-ivory/50">
                    <div className="p-8 border-b border-border bg-ivory/5">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">💌</span>
                            <h2 className="font-playfair text-2xl font-bold text-brown">Kesan & Pesan Perjalanan</h2>
                        </div>
                        <p className="text-xs text-brown-muted italic font-medium">Abadikan setiap kenangan indah, tantangan, dan perasaan kalian selama proses persiapan pernikahan ini.</p>
                    </div>
                    <div className="p-8 flex-grow flex flex-col">
                        <textarea
                            className="form-textarea flex-grow min-h-[400px] bg-ivory/10 border-ivory/50 focus:bg-white transition-all text-brown placeholder:text-brown-muted/30 font-medium leading-relaxed italic p-8 rounded-3xl shadow-inner-white border-dashed text-lg"
                            placeholder="Mulai tuliskan cerita kalian di sini... (cth: Perasaan saat pertama kali memilih vendor, momen lucu saat fitting busana, atau harapan untuk masa depan)"
                            value={kesan} onChange={e => setKesan(e.target.value)}
                        />
                        <div className="mt-4 flex justify-end">
                            <span className="text-[10px] font-bold text-brown-muted uppercase tracking-widest bg-ivory/50 px-3 py-1 rounded-full">Tersimpan Otomatis secara Lokal</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}