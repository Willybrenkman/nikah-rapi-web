// src/pages/ResetPassword.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function ResetPassword() {
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [ready, setReady] = useState(false) // token valid dari Supabase
    const navigate = useNavigate()

    // Cek session saat mount (token sudah diproses Supabase dari URL hash)
    useEffect(() => {
        // Cek jika session sudah ada (recovery link sudah diproses)
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) setReady(true)
        })

        // Fallback: dengarkan event jika belum diproses
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
                setReady(true)
            }
        })
        return () => subscription.unsubscribe()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (password.length < 6) { toast.error('Password minimal 6 karakter!'); return }
        if (password !== confirm) { toast.error('Konfirmasi password tidak cocok!'); return }
        setLoading(true)
        try {
            const { error } = await supabase.auth.updateUser({ password })
            if (error) {
                toast.error('Gagal reset password. Link mungkin sudah kadaluarsa.')
            } else {
                toast.success('Password berhasil diubah! Silakan login kembali.', { duration: 5000 })
                await supabase.auth.signOut()
                navigate('/login', { replace: true })
            }
        } catch (err) {
            console.error('[ResetPassword] error:', err)
            toast.error('Terjadi kesalahan sistem.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={pg}>
            <div style={bgOverlay} />
            <div className="animate-fade-up auth-card" style={{ zIndex: 1, position: 'relative' }}>
                <div style={{ textAlign: 'center', marginBottom: 8 }}>
                    <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, color: '#C9956C', letterSpacing: 2 }}>
                        NIKAH RAPI ✦
                    </h1>
                    <p style={{ fontSize: 13, color: '#9B8070', fontStyle: 'italic', marginTop: 4 }}>
                        Buat password baru untuk akunmu
                    </p>
                </div>

                <div style={{ height: 1, background: '#F0E6DF', margin: '24px 0' }} />

                {!ready ? (
                    <div style={{ textAlign: 'center', padding: '32px 0' }}>
                        <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
                        <p style={{ fontSize: 14, color: '#9B8070' }}>Memverifikasi link reset password...</p>
                        <p style={{ fontSize: 12, color: '#C9956C', marginTop: 12 }}>
                            Link tidak valid?{' '}
                            <span
                                onClick={() => navigate('/login')}
                                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                Kembali ke Login
                            </span>
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: 16, position: 'relative' }}>
                            <label style={labelStyle}>Password Baru</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-input"
                                placeholder="Minimal 6 karakter"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: 12, top: 34, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, padding: 4, color: '#9B8070' }}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <label style={labelStyle}>Konfirmasi Password Baru</label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Ulangi password baru"
                                value={confirm}
                                onChange={e => setConfirm(e.target.value)}
                            />
                        </div>

                        <button type="submit" disabled={loading} style={{ ...btn, width: '100%', opacity: loading ? .7 : 1, marginBottom: 12 }}>
                            {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            style={{ width: '100%', padding: '11px 0', background: 'transparent', border: '1.5px solid #F0E6DF', borderRadius: 10, fontSize: 14, color: '#9B8070', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}
                        >
                            ← Kembali ke Login
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

const pg = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FDFAF6', position: 'relative', overflow: 'hidden' }
const bgOverlay = { position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `radial-gradient(circle at 20% 20%, rgba(201,149,108,.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(232,196,184,.12) 0%, transparent 50%)` }
const labelStyle = { display: 'block', fontSize: 13, fontWeight: 500, color: '#2C1810', marginBottom: 6 }
const btn = { padding: '13px 0', background: '#C9956C', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", display: 'block' }
