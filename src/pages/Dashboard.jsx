// src/pages/Dashboard.jsx
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useWedding } from '../hooks/useWedding'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const COLORS = ['#C9956C', '#E8C4B8', '#8BAF8B', '#D4756B', '#E8A87C', '#a0c4a0', '#d4b0a0']
const rp = (n = 0) => n >= 1_000_000 ? `Rp ${(n / 1_000_000).toFixed(0)} Jt` : n >= 1_000 ? `Rp ${(n / 1_000).toFixed(0)} Rb` : `Rp ${n}`

function StatCard({ icon, value, label, sub, bg }) {
    return (
        <div className="stat-card hover:translate-y-[-4px] transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 mb-4 text-xl rounded-2xl shadow-inner" style={{ background: bg }}>
                {icon}
            </div>
            <div className="font-playfair text-3xl font-bold text-brown leading-tight">{value}</div>
            <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">{label}</div>
            {sub && <div className="text-[10px] font-semibold text-brown-muted/60 mt-2 bg-ivory/50 px-2 py-0.5 rounded-full inline-block">{sub}</div>}
        </div>
    )
}

function ProgressRow({ label, done, total, sage }) {
    const pct = total > 0 ? Math.round(done / total * 100) : 0
    return (
        <div className="mb-5 group">
            <div className="flex justify-between text-xs mb-2">
                <span className="text-brown-muted font-medium group-hover:text-brown transition-colors">{label}</span>
                <span className="font-bold text-brown">{done}/{total} <span className="text-rose-gold ml-1">({pct}%)</span></span>
            </div>
            <div className="progress-track h-2 bg-ivory shadow-inner">
                <div className={`progress-fill ${sage ? 'sage' : ''} shadow-sm`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    )
}

const Skeleton = ({ className }) => <div className={`animate-shimmer bg-ivory rounded-xl ${className}`} />

export default function Dashboard() {
    const navigate = useNavigate()
    const { wedding, hMin } = useWedding()
    const [budgetItems, setBudgetItems] = useState([])
    const [vendors, setVendors] = useState([])
    const [stats, setStats] = useState({ totalBudget: 0, usedBudget: 0, tamuConfirm: 0, totalTamu: 0, totalAngpao: 0, angpaoPemberi: 0, checklistDone: 0, checklistTotal: 0 })
    const [milestones, setMilestones] = useState({ administrasi: { done: 0, total: 0 }, venue: { done: 0, total: 0 }, mua: { done: 0, total: 0 }, dokumentasi: { done: 0, total: 0 } })
    const [loading, setLoading] = useState(true)

    useEffect(() => { fetchStats() }, [wedding])

    const fetchStats = async () => {
        if (!wedding) { setLoading(false); return }
        try {
            const [budgetRes, tamuRes, angpaoRes, checkRes, vendorRes] = await Promise.all([
                supabase.from('budget_items').select('*').eq('wedding_id', wedding.id),
                supabase.from('tamu_undangan').select('status_rsvp').eq('wedding_id', wedding.id),
                supabase.from('kado_angpao').select('nominal,jenis').eq('wedding_id', wedding.id),
                supabase.from('checklist_items').select('is_done,kategori').eq('wedding_id', wedding.id),
                supabase.from('vendors').select('*').eq('wedding_id', wedding.id).order('deadline_pelunasan').limit(4)
            ])

            const items = budgetRes.data || []
            const tamuAll = tamuRes.data || []
            const angpaoList = angpaoRes.data || []
            const checks = checkRes.data || []
            const vendorList = vendorRes.data || []

            setBudgetItems(items)
            setVendors(vendorList)
            
            setStats({
                totalBudget: wedding.total_budget || 0,
                usedBudget: items.reduce((a, i) => a + (i.jumlah_aktual || 0), 0),
                tamuConfirm: tamuAll.filter(t => t.status_rsvp === 'hadir').length,
                totalTamu: tamuAll.length,
                totalAngpao: angpaoList.filter(a => a.jenis === 'Angpao' || a.jenis === 'Keduanya').reduce((a, i) => a + (i.nominal || 0), 0),
                angpaoPemberi: angpaoList.length,
                checklistDone: checks.filter(c => c.is_done).length,
                checklistTotal: checks.length,
            })

            // Calculate Milestones
            const getM = (keys) => {
                const sub = checks.filter(c => keys.some(k => (c.kategori || '').toLowerCase().includes(k)))
                return { done: sub.filter(s => s.is_done).length, total: sub.length }
            }
            setMilestones({
                administrasi: getM(['admin', 'kua', 'dokumen']),
                venue: getM(['venue', 'gedung', 'katering', 'makan']),
                mua: getM(['mua', 'baju', 'busana', 'rias']),
                dokumentasi: getM(['foto', 'video', 'dokumentasi'])
            })

        } catch (err) { console.error(err) }
        finally { setLoading(false) }
    }

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
            <div className="text-6xl animate-bounce-slow">💍</div>
            <div className="flex flex-col items-center gap-2">
                <p className="text-lg font-playfair font-bold text-brown">Mempersiapkan Dashboard...</p>
                <div className="w-48 h-1.5 progress-track overflow-hidden">
                    <div className="h-full bg-rose-gold animate-shimmer w-full" />
                </div>
            </div>
        </div>
    )

    const nama1 = wedding?.nama_pengantin_1 || 'Kamu'
    const nama2 = wedding?.nama_pengantin_2 || 'Pasangan'
    const usedPct = stats.totalBudget > 0 ? Math.round(stats.usedBudget / stats.totalBudget * 100) : 0

    const donutLabels = budgetItems.length > 0
        ? budgetItems.slice(0, 7).map(i => i.kategori || i.nama || 'Item')
        : ['Venue', 'Katering', 'Dekorasi', 'Foto/Video', 'Busana', 'Undangan', 'Lainnya']

    const donutValues = budgetItems.length > 0
        ? budgetItems.slice(0, 7).map(i => i.jumlah_estimasi || 0)
        : [20, 26, 13, 15, 8, 2.5, 4].map(v => v * 1_000_000)

    return (
        <div className="animate-fade-in pb-12">

            {/* ── GREETING ── */}
            <div className="greeting-card relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-110 transition-transform duration-1000" />
                <div className="relative z-10">
                    <h2 className="font-playfair text-3xl text-brown mb-2">
                        Halo, <span className="font-bold text-rose-gold">{nama1.split(' ')[0]}</span> & <span className="font-bold text-rose-gold">{nama2.split(' ')[0]}</span>! ✨
                    </h2>
                    <p className="text-sm text-brown/70 max-w-md">Persiapan hari bahagia kamu sedang dalam pantauan. Mari wujudkan pernikahan impian bersama-sama!</p>
                </div>
                {hMin !== null && (
                    <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-2xl px-8 py-4 text-center shrink-0 shadow-xl shadow-rose-gold/10 border border-white">
                        <div className="font-playfair text-4xl font-bold text-brown leading-tight mb-1">
                            {Math.max(0, hMin)}
                        </div>
                        <div className="text-[10px] text-rose-gold font-bold uppercase tracking-[0.2em]">HARI LAGI</div>
                    </div>
                )}
            </div>

            {/* ── STAT CARDS ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard icon="💎" value={rp(stats.totalBudget)} label="Total Anggaran" sub={`Estimasi total budget`} bg="#C9956C20" />
                <StatCard icon="💸" value={rp(stats.usedBudget)} label="Dana Terpakai" sub={`${usedPct}% terealisasi`} bg="#D4756B15" />
                <StatCard icon="💌" value={String(stats.tamuConfirm)} label="Tamu Konfirmasi" sub={`Dari ${stats.totalTamu} undangan`} bg="#8BAF8B20" />
                <StatCard icon="✨" value={rp(stats.totalAngpao)} label="Total Angpao" sub={`${stats.angpaoPemberi} orang pemberi`} bg="#E8C4B840" />
            </div>

            {/* ── CHARTS ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="card">
                    <div className="p-6 border-b border-border flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-brown font-playfair">Distribusi Budget</h3>
                            <p className="text-[11px] text-brown-muted uppercase tracking-wider mt-1">Per kategori pengeluaran terbesar</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-ivory flex items-center justify-center text-lg">📊</div>
                    </div>
                    <div className="p-4 sm:p-8 h-[280px] flex items-center justify-center">
                        {loading ? <Skeleton className="w-48 h-48 rounded-full" /> : (
                            <Doughnut data={{
                            labels: donutLabels,
                            datasets: [{ 
                                data: donutValues, 
                                backgroundColor: COLORS, 
                                borderWidth: 6, 
                                borderColor: '#fff',
                                hoverOffset: 20
                            }]
                        }} options={{ 
                            responsive: true, 
                            maintainAspectRatio: false, 
                            cutout: '72%', 
                            plugins: { 
                                legend: { 
                                    position: 'right', 
                                    labels: { 
                                        font: { family: "'DM Sans', sans-serif", size: 10, weight: '500' }, 
                                        boxWidth: 8, 
                                        padding: 12,
                                        usePointStyle: true
                                    } 
                                } 
                            } 
                        }} />
                        )}
                    </div>
                </div>

                <div className="card">
                    <div className="p-6 border-b border-border flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-brown font-playfair">Pengeluaran Realisasi</h3>
                            <p className="text-[11px] text-brown-muted uppercase tracking-wider mt-1">Estimasi vs Aktual 6 Kategori</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-ivory flex items-center justify-center text-lg">📉</div>
                    </div>
                    <div className="p-4 sm:p-8 h-[280px] flex items-center justify-center">
                        {loading ? <Skeleton className="w-full h-full" /> : (
                            <Bar data={{
                            labels: budgetItems.slice(0, 6).map(i => (i.kategori || '').substring(0, 10)),
                            datasets: [
                                { label: 'Estimasi', data: budgetItems.slice(0, 6).map(i => i.jumlah_estimasi || 0), backgroundColor: '#C9956C80', borderRadius: 8 },
                                { label: 'Aktual', data: budgetItems.slice(0, 6).map(i => i.jumlah_aktual || 0), backgroundColor: '#8BAF8BCC', borderRadius: 8 },
                            ]
                        }} options={{ 
                            responsive: true, 
                            maintainAspectRatio: false, 
                            plugins: { legend: { position: 'bottom', labels: { font: { size: 10 }, usePointStyle: true, padding: 20 } } }, 
                            scales: { 
                                y: { beginAtZero: true, grid: { color: '#F0E6DF', drawBorder: false }, ticks: { font: { size: 10 } } }, 
                                x: { grid: { display: false }, ticks: { font: { size: 10, weight: '600' } } } 
                            } 
                        }} />
                        )}
                    </div>
                </div>
            </div>

            {/* ── BOTTOM ROW ── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Checklist progress */}
                <div className="card lg:col-span-2">
                    <div className="p-6 border-b border-border mb-6">
                        <h3 className="text-lg font-bold text-brown font-playfair">Progress Persiapan</h3>
                    </div>
                    <div className="px-6 pb-6">
                        <ProgressRow label="Total Checklist" done={stats.checklistDone} total={stats.checklistTotal} />
                        <div className="space-y-1 mt-8">
                            <h4 className="text-[10px] font-bold text-brown-muted uppercase tracking-[0.2em] mb-4">Milestone Utama</h4>
                            <ProgressRow label="Administrasi & KUA" done={milestones.administrasi.done} total={milestones.administrasi.total} sage />
                            <ProgressRow label="Venue & Katering" done={milestones.venue.done} total={milestones.venue.total} />
                            <ProgressRow label="MUA & Busana" done={milestones.mua.done} total={milestones.mua.total} sage />
                            <ProgressRow label="Dokumentasi" done={milestones.dokumentasi.done} total={milestones.dokumentasi.total} />
                        </div>
                    </div>
                </div>

                {/* Vendor deadline */}
                <div className="card lg:col-span-3 p-0 overflow-hidden">
                    <div className="p-6 border-b border-border flex items-center justify-between">
                        <h3 className="text-lg font-bold text-brown font-playfair">Deadline Vendor Terdekat</h3>
                        <button className="text-rose-gold text-xs font-bold hover:underline" onClick={() => navigate('/vendors')}>Lihat Semua</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table>
                            <thead>
                                <tr>
                                    <th className="th">Vendor</th>
                                    <th className="th">Kategori</th>
                                    <th className="th">Deadline</th>
                                    <th className="th">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vendors.length === 0 ? (
                                    <tr><td colSpan={4} className="td text-center py-10 text-brown-muted italic text-xs">Belum ada vendor dengan deadline pelunasan.</td></tr>
                                ) : vendors.map((v, i) => {
                                    let sisa = null
                                    if (v.deadline_pelunasan) {
                                        sisa = Math.ceil((new Date(v.deadline_pelunasan) - new Date()) / 86_400_000)
                                    }
                                    const badge = sisa <= 14 ? 'badge-red' : sisa <= 30 ? 'badge-yellow' : 'badge-green'
                                    return (
                                        <tr key={v.id} className="tr hover:bg-ivory/30 group">
                                            <td className="td font-bold text-brown">{v.nama}</td>
                                            <td className="td"><span className="text-[10px] font-bold text-brown-muted bg-ivory px-2 py-0.5 rounded-md">{v.kategori}</span></td>
                                            <td className="td text-brown-muted text-xs font-medium">
                                                {v.deadline_pelunasan ? new Date(v.deadline_pelunasan).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '—'}
                                            </td>
                                            <td className="td">
                                                {sisa !== null ? (
                                                    <span className={`badge ${badge} shadow-sm`}>{sisa <= 0 ? 'Hari Ini / Lewat' : `${sisa} hr lagi`}</span>
                                                ) : <span className="text-brown-muted opacity-30 text-[10px]">TBA</span>}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}