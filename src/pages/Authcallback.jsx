// src/pages/AuthCallback.jsx
// ✅ STRATEGI: Karena supabase client punya detectSessionInUrl:true,
// Supabase OTOMATIS exchange code/hash dari URL saat client init.
// Kita TIDAK BOLEH manual exchangeCodeForSession() — itu akan bentrok.
// Pendekatan: tunggu onAuthStateChange(SIGNED_IN) yang pasti fire
// setelah Supabase selesai proses token.

import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthCallback() {
    const navigate = useNavigate()
    const [status, setStatus] = useState('loading')
    const [userData, setUserData] = useState(null)
    const handledRef = useRef(false) // Mencegah double-handling

    useEffect(() => {
        let mounted = true
        let safetyTimeout = null

        // ── Fungsi untuk handle setelah session tersedia ──
        const handlePostAuth = async (user) => {
            if (!mounted || handledRef.current) return
            handledRef.current = true

            try {
                setUserData(user)

                // Cek apakah sudah punya wedding profile
                const { data: profile } = await supabase
                    .from('wedding_profiles')
                    .select('id')
                    .eq('user_id', user.id)
                    .single()

                if (!mounted) return

                setStatus('success')

                // Redirect ke dashboard (jika ada profil) atau onboarding
                const destination = profile ? '/dashboard' : '/onboarding'

                setTimeout(() => {
                    if (mounted) {
                        navigate(destination, { replace: true })
                    }
                }, 3500)
            } catch (err) {
                console.error('handlePostAuth error:', err)
                if (mounted) {
                    // Tetap anggap sukses — user sudah login
                    setStatus('success')
                    setTimeout(() => {
                        if (mounted) navigate('/dashboard', { replace: true })
                    }, 3500)
                }
            }
        }

        // ── LANGKAH 1: Pasang listener DULU sebelum cek session ──
        // Ini menangkap SIGNED_IN event dari detectSessionInUrl
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (!mounted || handledRef.current) return

                if (event === 'SIGNED_IN' && session?.user) {
                    clearTimeout(safetyTimeout)
                    handlePostAuth(session.user)
                }
            }
        )

        // ── LANGKAH 2: Cek apakah session SUDAH ada ──
        // (Mungkin detectSessionInUrl sudah selesai sebelum listener terpasang)
        const checkExistingSession = async () => {
            if (handledRef.current) return

            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user && mounted && !handledRef.current) {
                clearTimeout(safetyTimeout)
                handlePostAuth(session.user)
            }
        }

        checkExistingSession()

        // ── LANGKAH 3: Safety timeout 15 detik ──
        safetyTimeout = setTimeout(() => {
            if (mounted && !handledRef.current) {
                handledRef.current = true
                setStatus('error')
            }
        }, 15000)

        return () => {
            mounted = false
            subscription.unsubscribe()
            clearTimeout(safetyTimeout)
        }
    }, [navigate])

    // ── LOADING ──────────────────────────────────────────────
    if (status === 'loading') return (
        <div className="min-h-screen flex items-center justify-center bg-ivory relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(201,149,108,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(232,196,184,0.12)_0%,transparent_50%)]" />
            <div className="card w-[460px] max-w-[90vw] text-center p-12 z-10 animate-fade-up">
                <div className="text-6xl mb-4 animate-pulse-logo">💍</div>
                <h1 className="font-playfair text-2xl text-brown mb-2">Memverifikasi akun...</h1>
                <p className="text-sm text-brown-muted mb-6">Mohon tunggu sebentar</p>
                <div className="w-8 h-8 border-3 border-border border-t-rose-gold rounded-full animate-spin mx-auto" />
            </div>
        </div>
    )

    // ── ERROR ─────────────────────────────────────────────────
    if (status === 'error') return (
        <div className="min-h-screen flex items-center justify-center bg-ivory relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(201,149,108,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(232,196,184,0.12)_0%,transparent_50%)]" />
            <div className="card w-[460px] max-w-[90vw] text-center p-12 z-10 animate-fade-up">
                <div className="text-6xl mb-4">😕</div>
                <h1 className="font-playfair text-2xl text-brown mb-2">Link Tidak Valid</h1>
                <p className="text-sm text-brown-muted mb-8 leading-relaxed">
                    Link konfirmasi sudah kadaluarsa atau tidak valid.<br />
                    Silakan daftar ulang atau minta link baru.
                </p>
                <button onClick={() => navigate('/login')} className="btn-rose w-full justify-center py-3">
                    Kembali ke Login
                </button>
            </div>
        </div>
    )

    // ── SUCCESS ───────────────────────────────────────────────
    return (
        <div className="min-h-screen flex items-center justify-center bg-ivory relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(201,149,108,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(232,196,184,0.12)_0%,transparent_50%)]" />

            {/* Confetti dots */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(12)].map((_, i) => (
                    <div key={i}
                        className="absolute rounded-full opacity-60 animate-fade-in"
                        style={{
                            width: 8 + (i % 3) * 4,
                            height: 8 + (i % 3) * 4,
                            background: ['#C9956C', '#E8C4B8', '#8BAF8B', '#FDFAF6'][i % 4],
                            top: `${10 + (i * 7) % 80}%`,
                            left: `${5 + (i * 13) % 90}%`,
                            animationDelay: `${i * 0.1}s`
                        }}
                    />
                ))}
            </div>

            <div className="card w-[460px] max-w-[90vw] text-center p-12 z-10 animate-fade-up">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-gold to-dusty-pink flex items-center justify-center text-4xl shadow-lg shadow-rose-gold/30 mx-auto mb-5">
                    💍
                </div>

                <div className="badge-green mb-5 px-4 py-1.5">
                    ✓ Email Terverifikasi
                </div>

                <h1 className="font-playfair text-3xl text-brown mb-2">Selamat Datang! 🎉</h1>
                <p className="text-sm text-brown-muted mb-6">Akun kamu berhasil diaktivasi.</p>

                {userData?.email && (
                    <p className="text-sm font-semibold text-rose-gold mb-8">{userData.email}</p>
                )}

                <div className="h-px bg-border w-full mb-6" />

                <p className="text-xs text-brown-muted mb-5">✨ Kamu akan diarahkan otomatis dalam beberapa detik...</p>

                <div className="progress-track mb-8">
                    <div className="progress-fill" style={{ animation: 'progress-fill 3.5s linear forwards' }} />
                </div>

                <button onClick={() => navigate('/dashboard', { replace: true })} className="btn-rose w-full justify-center py-3">
                    Masuk ke Dashboard 💍
                </button>

                <p className="text-xs text-brown-muted mt-4">
                    Belum punya profil?{' '}
                    <span className="text-rose-gold cursor-pointer font-bold hover:underline" onClick={() => navigate('/onboarding', { replace: true })}>
                        Mulai Setup Profil
                    </span>
                </p>
            </div>

            <style>{`
                @keyframes progress-fill {
                    from { width: 0% }
                    to   { width: 100% }
                }
            `}</style>
        </div>
    )
}