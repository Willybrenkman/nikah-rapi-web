// src/pages/ActivityLogs.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useWedding } from '../hooks/useWedding'
import toast from 'react-hot-toast'

export default function ActivityLogs() {
    const { wedding } = useWedding()
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => { if (wedding) fetchLogs() }, [wedding])

    const fetchLogs = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('activity_logs')
                .select('*')
                .eq('wedding_id', wedding.id)
                .order('created_at', { ascending: false })
                .limit(100)
            
            if (error) throw error
            setLogs(data || [])
        } catch (err) {
            console.error(err)
            toast.error('Gagal mengambil riwayat aktivitas')
        } finally {
            setLoading(false)
        }
    }

    const getTime = (date) => {
        return new Date(date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }

    const getDate = (date) => {
        return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    }

    return (
        <div className="animate-fade-in pb-12">
            <div className="section-header">
                <div>
                    <h1 className="section-title">Riwayat Aktivitas 🕵️‍♂️</h1>
                    <p className="section-subtitle">Pantau semua perubahan data yang dilakukan di aplikasi ini</p>
                </div>
                <button className="btn-outline px-6" onClick={fetchLogs}>Refresh</button>
            </div>

            <div className="card p-0 overflow-hidden shadow-sm border-ivory/50">
                <div className="p-6 border-b border-border bg-ivory/5">
                    <h2 className="font-playfair text-lg font-bold text-brown">Log Terbaru (100 Aktivitas Terakhir)</h2>
                </div>
                
                {loading ? (
                    <div className="p-20 text-center text-brown-muted italic">Memuat riwayat...</div>
                ) : logs.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="text-4xl mb-4">📜</div>
                        <p className="text-brown-muted italic font-medium">Belum ada riwayat aktivitas tercatat.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-ivory/20">
                                    <th className="th py-4 px-6 text-left">Waktu</th>
                                    <th className="th py-4 px-6 text-left">User</th>
                                    <th className="th py-4 px-6 text-left">Aksi</th>
                                    <th className="th py-4 px-6 text-left">Detail Perubahan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {logs.map(log => (
                                    <tr key={log.id} className="hover:bg-ivory/10 transition-colors">
                                        <td className="py-4 px-6 align-top">
                                            <div className="font-black text-brown text-xs">{getTime(log.created_at)}</div>
                                            <div className="text-[10px] text-brown-muted">{getDate(log.created_at)}</div>
                                        </td>
                                        <td className="py-4 px-6 align-top">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-rose-gold/20 flex items-center justify-center text-[10px] font-bold text-rose-dark">
                                                    {log.user_email?.substring(0, 2).toUpperCase() || 'U'}
                                                </div>
                                                <span className="text-[11px] font-bold text-brown truncate max-w-[120px]">{log.user_email || 'System'}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 align-top">
                                            <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
                                                log.action.includes('Tambah') ? 'bg-sage/10 text-sage' : 
                                                log.action.includes('Hapus') ? 'bg-danger/10 text-danger' : 
                                                'bg-blue-500/10 text-blue-600'
                                            }`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-xs text-brown-muted font-medium leading-relaxed">
                                            {log.details}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
