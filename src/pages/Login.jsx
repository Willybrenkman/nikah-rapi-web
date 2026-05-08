import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [mode, setMode] = useState('login') // 'login' | 'register'
    const [showPassword, setShowPassword] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const { user, hasAccess } = useAuth()

    // ✅ Jika user sudah login, redirect ke dashboard
    useEffect(() => {
        if (user) {
            navigate(hasAccess ? '/dashboard' : '/claim-code', { replace: true })
        }
    }, [user, hasAccess, navigate])

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        if (params.get('reason') === 'timeout') {
            toast.error('Sesi berakhir karena tidak ada aktivitas selama 30 menit. Silakan masuk kembali.', {
                duration: 6000,
                id: 'timeout-toast'
            })
        }
    }, [location])

    // ── LOGIN dengan Email + Password ──
    const handleLogin = async (e) => {
        e.preventDefault()
        if (!email || !password) { toast.error('Isi email dan password!'); return }
        setLoading(true)

        const { error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
            if (error.message.includes('Invalid login')) {
                toast.error('Email atau password salah!')
            } else if (error.message.includes('Email not confirmed')) {
                toast.error('Email belum dikonfirmasi. Cek inbox email kamu.')
            } else {
                toast.error(error.message)
            }
        } else {
            toast.success('Berhasil masuk! 💍')
            navigate('/dashboard')
        }
        setLoading(false)
    }

    // ── REGISTER dengan Email + Password ──
    const handleRegister = async (e) => {
        e.preventDefault()
        if (!email || !password) { toast.error('Isi semua field!'); return }
        if (password.length < 6) { toast.error('Password minimal 6 karakter!'); return }
        if (password !== confirmPassword) { toast.error('Konfirmasi password tidak cocok!'); return }

        setLoading(true)

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`
            }
        })

        if (error) {
            if (error.message.includes('already registered')) {
                toast.error('Email sudah terdaftar! Silakan login.')
                setMode('login')
            } else {
                toast.error(error.message)
            }
        } else {
            toast.success('Akun berhasil dibuat! Cek email untuk konfirmasi. 📬', { duration: 6000 })
            setMode('login')
            setPassword('')
            setConfirmPassword('')
        }
        setLoading(false)
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
                        Rencanakan momen terbaik hidupmu 💍
                    </p>
                </div>

                {/* Tab Toggle */}
                <div style={{ display: 'flex', gap: 0, marginTop: 20, marginBottom: 24, borderRadius: 10, overflow: 'hidden', border: '1px solid #F0E6DF' }}>
                    <button
                        type="button"
                        onClick={() => setMode('login')}
                        style={{
                            flex: 1, padding: '10px 0', border: 'none', cursor: 'pointer',
                            fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600,
                            background: mode === 'login' ? '#C9956C' : 'transparent',
                            color: mode === 'login' ? '#fff' : '#9B8070',
                            transition: 'all .2s'
                        }}
                    >
                        Masuk
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('register')}
                        style={{
                            flex: 1, padding: '10px 0', border: 'none', cursor: 'pointer',
                            fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600,
                            background: mode === 'register' ? '#C9956C' : 'transparent',
                            color: mode === 'register' ? '#fff' : '#9B8070',
                            transition: 'all .2s'
                        }}
                    >
                        Daftar Baru
                    </button>
                </div>

                <form onSubmit={mode === 'login' ? handleLogin : handleRegister}>
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
                    <div style={{ marginBottom: 16, position: 'relative' }}>
                        <label className="form-label" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#2C1810', marginBottom: 6 }}>Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-input"
                            placeholder={mode === 'register' ? 'Minimal 6 karakter' : 'Masukkan password'}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute', right: 12, top: 34,
                                background: 'none', border: 'none', cursor: 'pointer',
                                fontSize: 16, padding: 4, color: '#9B8070'
                            }}
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>

                    {/* Confirm Password (register only) */}
                    {mode === 'register' && (
                        <div style={{ marginBottom: 16 }}>
                            <label className="form-label" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#2C1810', marginBottom: 6 }}>Konfirmasi Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-input"
                                placeholder="Ketik ulang password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    )}

                    {/* Forgot Password Link (login only) */}
                    {mode === 'login' && (
                        <div style={{ textAlign: 'right', marginBottom: 16 }}>
                            <span
                                onClick={() => navigate('/forgot-password')}
                                style={{ fontSize: 12, color: '#C9956C', cursor: 'pointer', fontWeight: 500 }}
                            >
                                Lupa password?
                            </span>
                        </div>
                    )}

                    <button type="submit" disabled={loading} style={{ ...btnStyle, width: '100%', marginTop: 8, opacity: loading ? .7 : 1 }}>
                        {loading
                            ? (mode === 'login' ? 'Memproses...' : 'Mendaftarkan...')
                            : (mode === 'login' ? 'Masuk ke Akun ✨' : 'Daftar Sekarang ✨')
                        }
                    </button>

                    {mode === 'register' && (
                        <p style={{ fontSize: 11, color: '#9B8070', marginTop: 12, textAlign: 'center', lineHeight: 1.5 }}>
                            📬 Email konfirmasi akan dikirim untuk verifikasi akun.
                            <br />Setelah itu, kamu bisa login dengan password tanpa perlu email lagi.
                        </p>
                    )}
                </form>
            </div>
        </div>
    )
}

const pg = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FDFAF6', position: 'relative', overflow: 'hidden' }
const bg = { position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `radial-gradient(circle at 20% 20%, rgba(201,149,108,.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(232,196,184,.12) 0%, transparent 50%)` }
const floral = { position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9956C' fill-opacity='0.05'%3E%3Cpath d='M30 30c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10S30 35.5 30 30zm-20 0c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10S10 35.5 10 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }
const btnStyle = { padding: '13px 0', background: '#C9956C', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", display: 'block' }