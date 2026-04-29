// src/pages/Pengaturan.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useWedding } from '../hooks/useWedding'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

export default function Pengaturan() {
    const { wedding, refetch } = useWedding()
    const { user } = useAuth()
    const [form, setForm] = useState({ nama_pengantin_1: '', nama_pengantin_2: '', tanggal_pernikahan: '', lokasi_akad: '', lokasi_resepsi: '', total_budget: '' })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (wedding) setForm({
            nama_pengantin_1: wedding.nama_pengantin_1 || '',
            nama_pengantin_2: wedding.nama_pengantin_2 || '',
            tanggal_pernikahan: wedding.tanggal_pernikahan || '',
            lokasi_akad: wedding.lokasi_akad || '',
            lokasi_resepsi: wedding.lokasi_resepsi || '',
            total_budget: wedding.total_budget || '',
        })
    }, [wedding])

    const handleSave = async () => {
        setSaving(true)
        const payload = { ...form, total_budget: Number(form.total_budget) || 0, user_id: user.id }
        if (wedding) {
            await supabase.from('wedding_profiles').update(payload).eq('id', wedding.id)
        } else {
            await supabase.from('wedding_profiles').insert(payload)
        }
        await refetch()
        toast.success('✅ Pengaturan berhasil disimpan!')
        setSaving(false)
    }

    const card = { background: '#fff', borderRadius: 16, border: '1px solid #F0E6DF', padding: 24, boxShadow: '0 2px 16px rgba(201,149,108,.06)' }

    return (
        <div className="animate-fade-in pb-12">
            <div className="section-header">
                <div>
                    <h1 className="section-title">Pengaturan & Profil ⚙️</h1>
                    <p className="section-subtitle">Konfigurasi informasi dasar dan preferensi pernikahan kalian</p>
                </div>
                <button className="btn-rose px-8 shadow-lg shadow-rose-gold/20 flex items-center gap-2" onClick={handleSave} disabled={saving}>
                    {saving ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Menyimpan...
                        </>
                    ) : (
                        <>💾 Simpan Perubahan</>
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Profil */}
                <div className="card shadow-sm border-ivory/50">
                    <div className="p-6 border-b border-border bg-ivory/5 flex items-center gap-3">
                        <span className="text-xl">💍</span>
                        <h2 className="font-playfair text-lg font-bold text-brown">Profil Pasangan Pengantin</h2>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="form-group">
                            <label className="form-label">Nama Pengantin Wanita</label>
                            <input className="form-input shadow-inner-white" placeholder="Masukkan nama lengkap pengantin wanita..." value={form.nama_pengantin_1} onChange={e => setForm(p => ({ ...p, nama_pengantin_1: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Nama Pengantin Pria</label>
                            <input className="form-input shadow-inner-white" placeholder="Masukkan nama lengkap pengantin pria..." value={form.nama_pengantin_2} onChange={e => setForm(p => ({ ...p, nama_pengantin_2: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Alamat Email Terdaftar</label>
                            <input className="form-input bg-ivory/20 cursor-not-allowed opacity-70" value={user?.email || ''} disabled />
                            <p className="text-[9px] text-brown-muted mt-2 italic font-bold uppercase tracking-widest">* Email tidak dapat diubah secara langsung</p>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Tanggal Hari Bahagia</label>
                            <input type="date" className="form-input shadow-inner-white" value={form.tanggal_pernikahan} onChange={e => setForm(p => ({ ...p, tanggal_pernikahan: e.target.value }))} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="form-label">Lokasi Akad Nikah</label>
                                <input className="form-input shadow-inner-white" placeholder="Nama Masjid / Gedung..." value={form.lokasi_akad} onChange={e => setForm(p => ({ ...p, lokasi_akad: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Lokasi Resepsi</label>
                                <input className="form-input shadow-inner-white" placeholder="Gedung / Ballrom..." value={form.lokasi_resepsi} onChange={e => setForm(p => ({ ...p, lokasi_resepsi: e.target.value }))} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Keuangan + Info */}
                <div className="space-y-8">
                    <div className="card shadow-sm border-ivory/50">
                        <div className="p-6 border-b border-border bg-ivory/5 flex items-center gap-3">
                            <span className="text-xl">💰</span>
                            <h2 className="font-playfair text-lg font-bold text-brown">Konfigurasi Anggaran</h2>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="form-group">
                                <label className="form-label">Target Total Budget Pernikahan</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-muted font-bold text-xs">Rp</span>
                                    <input type="number" className="form-input pl-12 shadow-inner-white font-bold text-brown" placeholder="cth: 150000000" value={form.total_budget} onChange={e => setForm(p => ({ ...p, total_budget: e.target.value }))} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Mata Uang & Regional</label>
                                <select className="form-select shadow-inner-white"><option>IDR — Rupiah Indonesia (Rp)</option></select>
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-sm border-ivory/50 overflow-hidden">
                        <div className="p-6 border-b border-border bg-ivory/5 flex items-center gap-3">
                            <span className="text-xl">ℹ️</span>
                            <h2 className="font-playfair text-lg font-bold text-brown">Informasi Aplikasi & Akun</h2>
                        </div>
                        <div className="p-8 space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-border/30">
                                <span className="text-xs font-medium text-brown-muted">Versi Aplikasi</span>
                                <span className="text-xs font-black text-rose-gold uppercase tracking-widest">Nikah Rapi v1.0 PRO</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-border/30">
                                <span className="text-xs font-medium text-brown-muted">Sistem Database</span>
                                <span className="text-xs font-bold text-brown italic">Supabase Cloud Ready</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-border/30">
                                <span className="text-xs font-medium text-brown-muted">Email Pengguna</span>
                                <span className="text-xs font-bold text-brown">{user?.email || '—'}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-border/30">
                                <span className="text-xs font-medium text-brown-muted">Terakhir Diperbarui</span>
                                <span className="text-xs font-bold text-brown">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            </div>
                            
                            <div className="pt-6">
                                <button
                                    onClick={async () => { 
                                        if (confirm('⚠️ PERHATIAN: Ini akan menghapus semua data profil wedding Anda. Data vendor, budget, dan tamu mungkin akan terpengaruh. Lanjutkan?')) { 
                                            await supabase.from('wedding_profiles').delete().eq('id', wedding?.id); 
                                            await refetch(); 
                                            toast.success('Data wedding berhasil direset.'); 
                                        } 
                                    }}
                                    className="w-full py-4 bg-transparent border-2 border-dashed border-rose-gold/30 rounded-2xl text-rose-gold text-xs font-black uppercase tracking-[0.2em] hover:bg-rose-gold/5 transition-colors group"
                                >
                                    <span className="group-hover:animate-pulse">🗑️ Reset Seluruh Data Wedding</span>
                                </button>
                                <p className="text-[9px] text-center text-brown-muted mt-3 italic font-medium">Gunakan tombol ini hanya jika Anda ingin memulai persiapan dari awal.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}