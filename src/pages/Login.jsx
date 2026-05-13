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

    // ✅ FORCE UPDATE PWA: Hapus service worker lama saat di halaman login
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function(registrations) {
                for(let registration of registrations) {
                    registration.unregister()
                }
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

    const handleLogin = async (e) => {
        e.preventDefault()
        if (!email || !password) { toast.error('Isi email dan password!'); return }
        setLoading(true)

        try {
            const { data: { session }, error } = await supabase.auth.signInWithPassword({ email, password })

            if (error) {
                if (error.message.includes('Invalid login')) {
                    toast.error('Email atau password salah!')
                } else {
                    toast.error('Gagal masuk. Silakan coba lagi.')
                }
                setLoading(false)
                return
            }

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

                <div style={{ height: 1, background: '#F0E6DF', margin: '24px 0' }} />

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
                    <div style={{ marginBottom: 20, position: 'relative' }}>
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
                            style={{
                                position: 'absolute', right: 12, top: 34,
                                background: 'none', border: 'none', cursor: 'pointer',
                                fontSize: 16, padding: 4, color: '#9B8070'
                            }}
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>

                    <button type="submit" disabled={loading} style={{ ...btn, width: '100%', opacity: loading ? .7 : 1 }}>
                        {loading ? 'Memproses...' : 'Masuk ke Akun ✨'}
                    </button>

                    <p style={{ fontSize: 12, color: '#9B8070', marginTop: 16, textAlign: 'center', lineHeight: 1.6 }}>
                        Belum punya akun? Hubungi CS kami setelah pembelian
                        <br />untuk mendapatkan akses login.
                    </p>
                </form>
            </div>
        </div>
    )
}

const pg = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FDFAF6', position: 'relative', overflow: 'hidden' }
const bg = { position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `radial-gradient(circle at 20% 20%, rgba(201,149,108,.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(232,196,184,.12) 0%, transparent 50%)` }
const floral = { position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9956C' fill-opacity='0.05'%3E%3Cpath d='M30 30c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10S30 35.5 30 30zm-20 0c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10S10 35.5 10 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }
const btn = { padding: '13px 0', background: '#C9956C', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", display: 'block' }