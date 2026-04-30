// src/pages/Profil.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { confirmDelete } from '../lib/swal'
import { useWedding } from '../hooks/useWedding'
import toast from 'react-hot-toast'

export default function Profil() {
    const { user, signOut } = useAuth()
    const { wedding } = useWedding()
    const navigate = useNavigate()
    const [pwForm, setPwForm] = useState({ current: '', newpw: '', confirm: '' })
    const [savingPw, setSavingPw] = useState(false)
    const [showPw, setShowPw] = useState(false)

    const handleChangePw = async (e) => {
        e.preventDefault()
        if (!pwForm.newpw) { toast.error('Isi password baru!'); return }
        if (pwForm.newpw.length < 6) { toast.error('Minimal 6 karakter!'); return }
        if (pwForm.newpw !== pwForm.confirm) { toast.error('Password tidak cocok!'); return }
        setSavingPw(true)
        const { error } = await supabase.auth.updateUser({ password: pwForm.newpw })
        if (error) { toast.error('Gagal ubah password!') }
        else { toast.success('Password berhasil diubah! 🔑'); setPwForm({ current: '', newpw: '', confirm: '' }); setShowPw(false) }
        setSavingPw(false)
    }

    const handleLogout = async () => {
        const result = await confirmDelete('Yakin mau keluar?', 'Anda harus login kembali untuk masuk.')
        if (!result.isConfirmed) return
        await signOut()
        toast.success('Sampai jumpa! 👋')
        navigate('/login', { replace: true })
    }

    if (!user) return null

    return (
        <div className="animate-fade-in max-w-2xl mx-auto">
            <div className="section-header">
                <div>
                    <h1 className="section-title">Profil Akun 👤</h1>
                    <p className="section-subtitle">Informasi akun dan keamanan</p>
                </div>
            </div>

            {/* Info akun */}
            <div className="card mb-6">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-gold to-dusty-pink flex items-center justify-center text-3xl shadow-sm">
                        💍
                    </div>
                    <div>
                        <h2 className="font-playfair text-xl font-bold text-brown mb-1">
                            {wedding?.nama_pengantin_1 || user?.email?.split('@')[0] || 'User'}
                            {wedding?.nama_pengantin_2 && ` & ${wedding.nama_pengantin_2}`}
                        </h2>
                        <p className="text-sm text-brown-muted mb-2">{user?.email}</p>
                        <span className="badge-green">
                            ✓ Email Terverifikasi
                        </span>
                    </div>
                </div>
                
                <div className="space-y-1">
                    <div className="summary-row">
                        <span className="text-brown-muted">Email</span>
                        <span className="font-semibold text-brown">{user?.email || '—'}</span>
                    </div>
                    <div className="summary-row">
                        <span className="text-brown-muted">User ID</span>
                        <span className="font-mono text-[11px] text-brown">{user?.id || '—'}</span>
                    </div>
                    <div className="summary-row">
                        <span className="text-brown-muted">Bergabung</span>
                        <span className="font-semibold text-brown">
                            {user?.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                        </span>
                    </div>
                    {wedding?.tanggal_pernikahan && (
                        <div className="summary-row">
                            <span className="text-brown-muted">Hari Pernikahan</span>
                            <span className="font-semibold text-brown">
                                {new Date(wedding.tanggal_pernikahan).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Ganti password */}
            <div className="card mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-playfair text-lg font-bold text-brown">🔑 Keamanan</h3>
                    <button 
                        onClick={() => setShowPw(p => !p)} 
                        className="btn-outline px-4 py-1.5"
                    >
                        {showPw ? 'Batal' : 'Ganti Password'}
                    </button>
                </div>
                
                {showPw && (
                    <form onSubmit={handleChangePw} className="animate-fade-in">
                        <div className="form-group mb-4">
                            <label className="form-label">Password Baru</label>
                            <input 
                                type="password" 
                                className="form-input" 
                                placeholder="Minimal 6 karakter" 
                                value={pwForm.newpw} 
                                onChange={e => setPwForm(p => ({ ...p, newpw: e.target.value }))} 
                            />
                        </div>
                        <div className="form-group mb-5">
                            <label className="form-label">Konfirmasi Password Baru</label>
                            <input 
                                type="password" 
                                className="form-input" 
                                placeholder="Ulangi password baru" 
                                value={pwForm.confirm} 
                                onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} 
                            />
                            {pwForm.confirm && pwForm.newpw !== pwForm.confirm && (
                                <p className="text-[12px] text-danger mt-1.5">Password tidak cocok</p>
                            )}
                        </div>
                        <button type="submit" disabled={savingPw} className="btn-rose w-full justify-center py-3">
                            {savingPw ? 'Menyimpan...' : 'Simpan Password Baru'}
                        </button>
                    </form>
                )}
            </div>

            {/* Danger zone */}
            <div className="card border-danger/20 bg-danger/[0.02]">
                <h3 className="font-playfair text-lg font-bold text-danger mb-4">⚠️ Zona Berbahaya</h3>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="text-sm font-semibold text-brown mb-0.5">Keluar dari NIKAH RAPI</div>
                        <p className="text-xs text-brown-muted">Kamu akan keluar dari sesi aktif di perangkat ini</p>
                    </div>
                    <button onClick={handleLogout} className="btn-outline border-danger text-danger hover:bg-danger hover:text-white px-6">
                        Keluar
                    </button>
                </div>
            </div>
        </div>
    )
}