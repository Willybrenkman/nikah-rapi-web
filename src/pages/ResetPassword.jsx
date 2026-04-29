// src/pages/ResetPassword.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function ResetPassword() {
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [loading, setLoading] = useState(false)
    const [validSession, setValidSession] = useState(false)
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        // Cek apakah ada session recovery dari link email
        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                setValidSession(true)
            }
            setChecking(false)
        })

        // Fallback: cek session existing
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) setValidSession(true)
            setChecking(false)
        })
    }, [])

    const handleReset = async (e) => {
        e.preventDefault()
        if (!password || !confirm) { toast.error('Isi semua field!'); return }
        if (password.length < 6) { toast.error('Password minimal 6 karakter!'); return }
        if (password !== confirm) { toast.error('Password tidak cocok!'); return }

        setLoading(true)
        const { error } = await supabase.auth.updateUser({ password })
        if (error) {
            toast.error('Gagal reset password. Coba lagi!')
        } else {
            toast.success('Password berhasil diubah! 🎉')
            setTimeout(() => navigate('/login', { replace: true }), 1500)
        }
        setLoading(false)
    }

    if (checking) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FDFAF6' }}>
            <div style={{ fontSize: 48, animation: 'pulse 1.5s ease-in-out infinite' }}>💍</div>
        </div>
    )

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#FDFAF6', position: 'relative', overflow: 'hidden',
        }}>
            {/* Background */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: `
          radial-gradient(circle at 20% 20%, rgba(201,149,108,.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(232,196,184,.12) 0%, transparent 50%)
        `,
            }} />
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9956C' fill-opacity='0.05'%3E%3Cpath d='M30 30c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10S30 35.5 30 30zm-20 0c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10S10 35.5 10 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />

            {/* Card */}
            <div className="animate-fade-up auth-card text-center">
                {/* Logo */}
                <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, color: '#C9956C', letterSpacing: 2, marginBottom: 4 }}>
                    NIKAH RAPI ✦
                </h1>
                <p style={{ fontSize: 13, color: '#9B8070', fontStyle: 'italic', marginBottom: 24 }}>
                    Buat password baru kamu 🔑
                </p>

                <div style={{ height: 1, background: '#F0E6DF', marginBottom: 24 }} />

                {!validSession ? (
                    <div>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
                        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: '#2C1810', marginBottom: 8 }}>
                            Link Tidak Valid
                        </div>
                        <p style={{ fontSize: 14, color: '#9B8070', marginBottom: 24, lineHeight: 1.6 }}>
                            Link reset password sudah kadaluarsa.<br />Minta link baru dari halaman lupa password.
                        </p>
                        <button
                            onClick={() => navigate('/forgot-password')}
                            style={{ width: '100%', padding: 13, background: '#C9956C', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}
                        >
                            Minta Link Baru
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleReset}>
                        <div style={{ textAlign: 'left', marginBottom: 16 }}>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#2C1810', marginBottom: 6 }}>
                                Password Baru
                            </label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Minimal 6 karakter"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>

                        <div style={{ textAlign: 'left', marginBottom: 24 }}>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#2C1810', marginBottom: 6 }}>
                                Konfirmasi Password
                            </label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Ulangi password baru"
                                value={confirm}
                                onChange={e => setConfirm(e.target.value)}
                            />
                            {confirm && password !== confirm && (
                                <p style={{ fontSize: 12, color: '#D4756B', marginTop: 4 }}>Password tidak cocok</p>
                            )}
                        </div>

                        {/* Password strength */}
                        {password && (
                            <div style={{ marginBottom: 20 }}>
                                <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} style={{
                                            flex: 1, height: 4, borderRadius: 99,
                                            background: password.length >= i * 3
                                                ? i <= 1 ? '#D4756B' : i <= 2 ? '#E8A87C' : i <= 3 ? '#C9956C' : '#8BAF8B'
                                                : '#F0E6DF',
                                            transition: 'background .3s',
                                        }} />
                                    ))}
                                </div>
                                <div style={{ fontSize: 11, color: '#9B8070', textAlign: 'left' }}>
                                    {password.length < 6 ? 'Terlalu pendek' : password.length < 8 ? 'Cukup' : password.length < 12 ? 'Bagus' : 'Sangat kuat'}
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%', padding: 13,
                                background: loading ? '#d4a882' : '#C9956C',
                                color: '#fff', border: 'none', borderRadius: 10,
                                fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                                fontFamily: "'DM Sans',sans-serif", transition: 'background .2s',
                            }}
                        >
                            {loading ? 'Menyimpan...' : 'Simpan Password Baru 🔑'}
                        </button>

                        <p style={{ fontSize: 12, color: '#9B8070', marginTop: 16 }}>
                            Ingat password lama?{' '}
                            <span style={{ color: '#C9956C', cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate('/login')}>
                                Masuk sekarang
                            </span>
                        </p>
                    </form>
                )}
            </div>
        </div>
    )
}