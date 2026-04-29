// src/pages/RSVPTracker.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useWedding } from '../hooks/useWedding'
import toast from 'react-hot-toast'

const statusBadge = { hadir: 'badge-green', tidak: 'badge-red', belum: 'badge-grey' }
const statusLabel = { hadir: 'Hadir', tidak: 'Tidak Hadir', belum: 'Belum Konfirmasi' }

export default function RSVPTracker() {
    const { wedding } = useWedding()
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => { if (wedding) fetchItems() }, [wedding])

    const fetchItems = async () => {
        setLoading(true)
        const { data } = await supabase.from('tamu_undangan').select('*').eq('wedding_id', wedding.id).order('nama')
        setItems(data || [])
        setLoading(false)
    }

    const updateStatus = async (id, status) => {
        await supabase.from('tamu_undangan').update({ status_rsvp: status }).eq('id', id)
        toast.success('Status RSVP diperbarui!')
        fetchItems()
    }

    const toggleKupon = async (item) => {
        await supabase.from('tamu_undangan').update({ kupon_makan: !item.kupon_makan }).eq('id', item.id)
        fetchItems()
    }

    const hadir = items.filter(i => i.status_rsvp === 'hadir').length
    const tidak = items.filter(i => i.status_rsvp === 'tidak').length
    const belum = items.filter(i => !i.status_rsvp || i.status_rsvp === 'belum').length
    const konfPct = items.length > 0 ? Math.round((hadir + tidak) / items.length * 100) : 0

    return (
        <div className="animate-fade-in pb-12">
            <div className="section-header">
                <div>
                    <h1 className="section-title">Pelacak RSVP ✉️</h1>
                    <p className="section-subtitle">Pantau konfirmasi kehadiran dan manajemen kupon makan tamu</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="stat-card border-sage/10 hover:shadow-lg transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-sage/10 flex items-center justify-center text-xl mb-4">✅</div>
                    <div className="font-playfair text-2xl font-bold text-brown leading-none">{hadir}</div>
                    <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Pasti Hadir</div>
                </div>
                <div className="stat-card border-danger/10 hover:shadow-lg transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-danger/5 flex items-center justify-center text-xl mb-4">❌</div>
                    <div className="font-playfair text-2xl font-bold text-brown leading-none">{tidak}</div>
                    <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Berhalangan</div>
                </div>
                <div className="stat-card border-ivory/50 hover:shadow-lg transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-ivory flex items-center justify-center text-xl mb-4">❓</div>
                    <div className="font-playfair text-2xl font-bold text-brown leading-none">{belum}</div>
                    <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Belum Respon</div>
                </div>
            </div>

            {/* Progress */}
            <div className="card mb-10 p-8 shadow-sm border-ivory/50">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <div className="text-[10px] font-black text-brown-muted uppercase tracking-[0.2em] mb-1">Status Respon Undangan</div>
                        <h2 className="font-playfair text-xl font-bold text-brown">Progres Konfirmasi Masuk</h2>
                    </div>
                    <div className="text-right">
                        <span className="text-xl font-playfair font-black text-rose-gold">{konfPct}%</span>
                        <p className="text-[10px] font-bold text-brown-muted uppercase tracking-widest">{hadir + tidak} dari {items.length} Tamu</p>
                    </div>
                </div>
                <div className="progress-track h-3 bg-ivory overflow-hidden rounded-full">
                    <div className="progress-fill shadow-sm relative overflow-hidden" style={{ width: `${konfPct}%` }}>
                        <div className="absolute inset-0 bg-white/10 animate-shimmer" />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="card p-0 overflow-hidden group/table shadow-sm border-ivory/50">
                <div className="p-6 border-b border-border bg-ivory/5 flex items-center justify-between">
                    <h2 className="font-playfair text-lg font-bold text-brown">Daftar Konfirmasi Tamu</h2>
                    <span className="text-[10px] font-bold text-brown-muted uppercase tracking-widest italic">{items.length} Tamu Terdaftar</span>
                </div>
                <div className="overflow-x-auto">
                    <table>
                        <thead>
                            <tr>
                                <th className="th w-16 text-center">No</th>
                                <th className="th">Nama Tamu</th>
                                <th className="th">Status RSVP</th>
                                <th className="th text-center">Pax</th>
                                <th className="th">Meja</th>
                                <th className="th">Kupon Makan</th>
                                <th className="th text-right pr-8">Update Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && items.length === 0 ? (
                                <tr><td colSpan={7} className="td text-center py-24 text-brown-muted italic">Meyiapkan data konfirmasi tamu...</td></tr>
                            ) : items.length === 0 ? (
                                <tr><td colSpan={7} className="td text-center py-24 text-brown-muted italic">Belum ada tamu terdaftar. Silakan tambah di menu Daftar Tamu.</td></tr>
                            ) : items.map((item, i) => {
                                const st = item.status_rsvp || 'belum'
                                return (
                                    <tr key={item.id} className="tr group hover:bg-ivory/10 transition-colors">
                                        <td className="td text-center text-[10px] text-brown-muted font-black tracking-widest">{String(i + 1).padStart(2, '0')}</td>
                                        <td className="td font-bold text-brown group-hover:text-rose-gold transition-colors">{item.nama}</td>
                                        <td className="td">
                                            <span className={`badge ${statusBadge[st] || 'badge-grey'} text-[9px] font-black uppercase tracking-tighter`}>
                                                {statusLabel[st] || st}
                                            </span>
                                        </td>
                                        <td className="td text-center font-black text-brown-muted text-xs">{st === 'hadir' ? (item.jumlah_orang || 1) : '—'}</td>
                                        <td className="td text-[10px] font-bold text-brown-muted italic">{item.no_meja || 'TBA'}</td>
                                        <td className="td">
                                            <button onClick={() => toggleKupon(item)} className="transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group/btn">
                                                {item.kupon_makan ? (
                                                    <span className="badge badge-green px-4 py-1 font-black uppercase text-[8px] shadow-sm">✓ Terambil</span>
                                                ) : (
                                                    <span className="badge badge-grey px-4 py-1 font-black uppercase text-[8px] group-hover/btn:border-rose-gold transition-colors">Belum</span>
                                                )}
                                            </button>
                                        </td>
                                        <td className="td text-right pr-8">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                {['hadir', 'tidak', 'belum'].map(s => (
                                                    <button 
                                                        key={s} 
                                                        onClick={() => updateStatus(item.id, s)}
                                                        className={`w-8 h-8 flex items-center justify-center rounded-xl text-[10px] font-black transition-all border shadow-sm ${
                                                            st === s 
                                                            ? 'bg-rose-gold border-rose-gold text-white scale-110' 
                                                            : 'bg-white border-border text-brown-muted hover:border-rose-gold hover:text-rose-gold hover:bg-rose-gold/5'
                                                        }`}
                                                        title={statusLabel[s]}
                                                    >
                                                        {s === 'hadir' ? '✓' : s === 'tidak' ? '✕' : '?'}
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}