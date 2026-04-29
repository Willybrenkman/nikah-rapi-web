// src/pages/Login.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function Login() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()
        if (!email) { toast.error('Isi email dulu!'); return }
        setLoading(true)
        const { error } = await supabase.auth.signInWithOtp({ 
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`
            }
        })
        if (error) {
            toast.error('Gagal mengirim link. Pastikan email valid.')
        } else {
            setSent(true)
            toast.success('Link akses terkirim! 💍')
        }
        setLoading(false)
    }

    if (sent) return (
        <div style={pg}>
            <div style={bg} /><div style={floral} />
            <div className="animate-fade-up auth-card" style={{ zIndex: 1, position: 'relative' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>📬</div>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: '#2C1810', marginBottom: 8 }}>Cek Email Kamu!</h2>
                <p style={{ fontSize: 14, color: '#9B8070', lineHeight: 1.7, marginBottom: 8 }}>Kami sudah kirim link masuk otomatis (Magic Link) ke:</p>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#C9956C', marginBottom: 24 }}>{email}</p>
                <div style={{ background: 'rgba(201,149,108,.08)', border: '1px solid #F0E6DF', borderRadius: 12, padding: '16px 20px', marginBottom: 24, textAlign: 'left' }}>
                    <p style={{ fontSize: 13, color: '#9B8070', lineHeight: 1.8 }}>
                        1. Buka Kotak Masuk email-mu<br />
                        2. Klik tombol link yang ada di dalam email<br />
                        3. Kamu akan otomatis masuk tanpa password! 💍
                    </p>
                </div>
                <button onClick={() => setSent(false)} style={{ ...btn, width: '100%', background: 'transparent', color: '#9B8070', border: '1px solid #F0E6DF' }}>
                    Kembali / Ganti Email
                </button>
            </div>
        </div>
    )

    return (
        <div style={pg}>
            <div style={bg} /><div style={floral} />
            <div className="animate-fade-up auth-card" style={{ zIndex: 1, position: 'relative' }}>
                <div style={{ textAlign: 'center', marginBottom: 8 }}>
                    <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, color: '#C9956C', letterSpacing: 2 }}>NIKAH RAPI ✦</h1>
                    <p style={{ fontSize: 13, color: '#9B8070', fontStyle: 'italic', marginTop: 4 }}>Rencanakan momen terbaik hidupmu 💍</p>
                </div>
                <div style={{ height: 1, background: '#F0E6DF', margin: '24px 0' }} />
                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: 20 }}>
                        <label className="form-label" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#2C1810', marginBottom: 6 }}>Email Pribadi</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="email@contoh.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <p style={{ fontSize: 12, color: '#9B8070', marginTop: 8, lineHeight: 1.5 }}>
                            Kami akan mengirimkan "Magic Link" ke email ini. Tidak perlu mengingat password!
                        </p>
                    </div>

                    <button type="submit" disabled={loading} style={{ ...btn, width: '100%', marginTop: 8, opacity: loading ? .7 : 1 }}>
                        {loading ? 'Mengirim Link...' : 'Kirim Link Akses Masuk ✨'}
                    </button>
                </form>
            </div>
        </div>
    )
}

const pg = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FDFAF6', position: 'relative', overflow: 'hidden' }
const bg = { position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `radial-gradient(circle at 20% 20%, rgba(201,149,108,.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(232,196,184,.12) 0%, transparent 50%)` }
const floral = { position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9956C' fill-opacity='0.05'%3E%3Cpath d='M30 30c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10S30 35.5 30 30zm-20 0c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10S10 35.5 10 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }
const btn = { padding: '13px 0', background: '#C9956C', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", display: 'block' }