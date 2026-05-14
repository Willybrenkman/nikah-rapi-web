// src/pages/Login.jsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [mode, setMode] = useState('login') // 'login' | 'forgot'
    const [failCount, setFailCount] = useState(0)
    const [cooldownUntil, setCooldownUntil] = useState(null)
    const location = useLocation()
    const navigate = useNavigate()
    const { user } = useAuth()
    const pendingRedirectRef = useRef(null)

    // Navigate only after AuthContext.user is confirmed set to avoid ProtectedRoute race
    useEffect(() => {
        if (!user) return
        const dest = pendingRedirectRef.current || '/dashboard'
        pendingRedirectRef.current = null
        navigate(dest, { replace: true })
    }, [user, navigate])

    // Hapus service worker lama saat di halaman login (force update PWA)
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                for (const reg of registrations) reg.unregister()
            })
        }
    }, [])

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        if (params.get('reason') === 'timeout') {
            toast.error('Sesi berakhir karena tidak ada aktivitas selama 30 menit. Silakan masuk kembali.', {
                duration: 6000,
                id: 'timeout-toast'
            })
        }
    }, [location])

    const isCoolingDown = cooldownUntil && Date.now() < cooldownUntil
    const cooldownSecs = isCoolingDown ? Math.ceil((cooldownUntil - Date.now()) / 1000) : 0

    const handleLogin = async (e) => {
        e.preventDefault()
        if (isCoolingDown) { toast.error(`Terlalu banyak percobaan. Tunggu ${cooldownSecs} detik.`); return }
        if (!email || !password) { toast.error('Isi email dan password!'); return }
        setLoading(true)

        try {
            const cleanEmail = email.trim().toLowerCase()
            const { data: { session }, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password })

            if (error) {
                const newCount = failCount + 1
                setFailCount(newCount)
                if (newCount >= 5) {
                    setCooldownUntil(Date.now() + 30_000)
                    setFailCount(0)
                    toast.error('5x gagal login. Silakan tunggu 30 detik.')
                } else if (error.message.includes('Invalid login') || error.message.includes('invalid_credentials')) {
                    toast.error(`Email atau password salah! (${newCount}/5)`)
                } else {
                    toast.error('Gagal masuk. Silakan coba lagi.')
                }
                setLoading(false)
                return
            }

            setFailCount(0)
            setCooldownUntil(null)

            if (session?.user) {
                toast.success('Berhasil masuk! 💍')

                const { error: profileError } = await supabase
                    .from('wedding_profiles')
                    .select('id')
                    .eq('user_id', session.user.id)
                    .single()

                // Store destination — useEffect navigates once AuthContext.user is confirmed set
                pendingRedirectRef.current = (profileError?.code === 'PGRST116')
                    ? '/onboarding'
                    : '/dashboard'
            }
        } catch (err) {
            console.error('[Login] Unexpected error:', err)
            toast.error('Terjadi kesalahan sistem.')
        } finally {
            setLoading(false)
        }
    }

    const handleForgotPassword = async (e) => {
        e.preventDefault()
        const cleanEmail = email.trim().toLowerCase()
        if (!cleanEmail) { toast.error('Isi email kamu dulu!'); return }
        setLoading(true)
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
                redirectTo: `${window.location.origin}/reset-password`,
            })
            if (error) {
                toast.error('Gagal kirim email reset. Periksa alamat email kamu.')
            } else {
                toast.success('Link reset password sudah dikirim ke email kamu! Cek inbox atau folder spam.', { duration: 8000 })
                setTimeout(() => setMode('login'), 1500)
            }
        } catch (err) {
            console.error('[Login] Reset password error:', err)
            toast.error('Terjadi kesalahan sistem.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={pg}>
            <div style={bg} /><div style={floral} />
            <div className="animate-fade-up auth-card" style={{ zIndex: 1, position: 'relative' }}>
                <div style={{ textAlign: 'center', marginBottom: 8 }}>
                    <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, color: '#C9956C', letterSpacing: 2, cursor: 'default', userSelect: 'none' }}>
                        NIKAH RAPI ✦
                    </h1>
                    <p style={{ fontSize: 13, color: '#9B8070', fontStyle: 'italic', marginTop: 4 }}>
                        {mode === 'forgot' ? 'Reset password akun kamu' : 'Rencanakan momen terbaik hidupmu 💍'}
                    </p>
                </div>

                <div style={{ height: 1, background: '#F0E6DF', margin: '24px 0' }} />

                {mode === 'login' ? (
                    <form onSubmit={handleLogin}>
                        {/* Email */}
                        <div style={{ marginBottom: 16 }}>
                            <label className="form-label" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#2C1810', marginBottom: 6 }}>Email</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="email@contoh.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: 8, position: 'relative' }}>
                            <label className="form-label" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#2C1810', marginBottom: 6 }}>Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-input"
                                placeholder="Masukkan password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: 12, top: 34, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, padding: 4, color: '#9B8070' }}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>

                        {/* Lupa password link */}
                        <div style={{ textAlign: 'right', marginBottom: 20 }}>
                            <button
                                type="button"
                                onClick={() => setMode('forgot')}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#C9956C', fontWeight: 500, padding: 0 }}
                            >
                                Lupa password?
                            </button>
                        </div>

                        {isCoolingDown && (
                            <div style={{ background: '#FFF5F0', border: '1px solid #F0E6DF', borderRadius: 8, padding: '10px 14px', marginBottom: 12, fontSize: 12, color: '#9B8070', textAlign: 'center' }}>
                                Terlalu banyak percobaan. Tunggu {cooldownSecs} detik sebelum coba lagi.
                            </div>
                        )}

                        <button type="submit" disabled={loading || isCoolingDown} style={{ ...btn, width: '100%', opacity: (loading || isCoolingDown) ? .6 : 1 }}>
                            {loading ? 'Memproses...' : 'Masuk ke Akun ✨'}
                        </button>

                        <p style={{ fontSize: 12, color: '#9B8070', marginTop: 16, textAlign: 'center', lineHeight: 1.6 }}>
                            Belum punya akun? Hubungi CS kami setelah pembelian
                            <br />untuk mendapatkan akses login.
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleForgotPassword}>
                        <p style={{ fontSize: 13, color: '#9B8070', marginBottom: 20, lineHeight: 1.7 }}>
                            Masukkan email yang terdaftar. Kami akan kirimkan link untuk reset password.
                        </p>
                        <div style={{ marginBottom: 20 }}>
                            <label className="form-label" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#2C1810', marginBottom: 6 }}>Email</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="email@contoh.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <button type="submit" disabled={loading} style={{ ...btn, width: '100%', opacity: loading ? .7 : 1, marginBottom: 12 }}>
                            {loading ? 'Mengirim...' : 'Kirim Link Reset Password'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('login')}
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
const bg = { position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `radial-gradient(circle at 20% 20%, rgba(201,149,108,.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(232,196,184,.12) 0%, transparent 50%)` }
const floral = { position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9956C' fill-opacity='0.05'%3E%3Cpath d='M30 30c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10S30 35.5 30 30zm-20 0c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10S10 35.5 10 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }
const btn = { padding: '13px 0', background: '#C9956C', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", display: 'block' }
