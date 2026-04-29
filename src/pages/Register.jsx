// src/pages/Register.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function Register() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '', confirm: '' })
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const handleRegister = async (e) => {
        e.preventDefault()
        if (!form.email || !form.password) { toast.error('Isi semua field!'); return }
        if (form.password.length < 6) { toast.error('Password minimal 6 karakter!'); return }
        if (form.password !== form.confirm) { toast.error('Password tidak cocok!'); return }
        setLoading(true)
        const { error } = await supabase.auth.signUp({
            email: form.email, password: form.password,
            options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
        })
        if (error) {
            toast.error(error.message === 'User already registered' ? 'Email sudah terdaftar!' : 'Gagal mendaftar.')
        } else { setSent(true) }
        setLoading(false)
    }

    if (sent) return (
        <div style={pg}>
            <div style={bg} /><div style={floral} />
            <div className="animate-fade-up auth-card">
                <div style={{ fontSize: 56, marginBottom: 16 }}>📬</div>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: '#2C1810', marginBottom: 8 }}>Cek Email Kamu!</h2>
                <p style={{ fontSize: 14, color: '#9B8070', lineHeight: 1.7, marginBottom: 8 }}>Kami sudah kirim link konfirmasi ke:</p>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#C9956C', marginBottom: 24 }}>{form.email}</p>
                <div style={{ background: 'rgba(201,149,108,.08)', border: '1px solid #F0E6DF', borderRadius: 12, padding: '16px 20px', marginBottom: 24, textAlign: 'left' }}>
                    <p style={{ fontSize: 13, color: '#9B8070', lineHeight: 1.8 }}>
                        1. Buka email dari <strong>Supabase Auth</strong><br />
                        2. Klik <strong>"Confirm your mail"</strong><br />
                        3. Kamu akan diarahkan ke halaman aktivasi 💍
                    </p>
                </div>
                <button onClick={() => navigate('/login')} style={{ ...btn, width: '100%' }}>Sudah Konfirmasi? Masuk →</button>
                <p style={{ textAlign: 'center', fontSize: 12, color: '#9B8070', marginTop: 12, cursor: 'pointer' }} onClick={() => setSent(false)}>Kirim ulang email</p>
            </div>
        </div>
    )

    return (
        <div style={pg}>
            <div style={bg} /><div style={floral} />
            <div className="animate-fade-up auth-card">
                <div style={{ textAlign: 'center', marginBottom: 8 }}>
                    <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, color: '#C9956C', letterSpacing: 2 }}>NIKAH RAPI ✦</h1>
                    <p style={{ fontSize: 13, color: '#9B8070', fontStyle: 'italic', marginTop: 4 }}>Mulai rencanakan pernikahan impianmu 💍</p>
                </div>
                <div style={{ height: 1, background: '#F0E6DF', margin: '24px 0' }} />
                <form onSubmit={handleRegister}>
                    {[
                        { label: 'Email', key: 'email', type: 'email', ph: 'email@contoh.com' },
                        { label: 'Password', key: 'password', type: 'password', ph: 'Minimal 6 karakter' },
                        { label: 'Konfirmasi Password', key: 'confirm', type: 'password', ph: 'Ulangi password' },
                    ].map(f => (
                        <div key={f.key} style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#2C1810', marginBottom: 6 }}>{f.label}</label>
                            <input type={f.type} className="form-input" placeholder={f.ph} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                        </div>
                    ))}
                    {form.confirm && form.password !== form.confirm && (
                        <p style={{ fontSize: 12, color: '#D4756B', marginBottom: 12, marginTop: -8 }}>Password tidak cocok</p>
                    )}
                    <button type="submit" disabled={loading} style={{ ...btn, width: '100%', marginTop: 8, opacity: loading ? .7 : 1 }}>
                        {loading ? 'Mendaftar...' : 'Daftar Sekarang 💍'}
                    </button>
                </form>
                <p style={{ textAlign: 'center', fontSize: 12, color: '#9B8070', marginTop: 16 }}>
                    Sudah punya akun?{' '}
                    <span style={{ color: '#C9956C', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/login')}>Masuk di sini</span>
                </p>
            </div>
        </div>
    )
}

const pg = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FDFAF6', position: 'relative', overflow: 'hidden' }
const bg = { position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `radial-gradient(circle at 20% 20%, rgba(201,149,108,.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(232,196,184,.12) 0%, transparent 50%)` }
const floral = { position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9956C' fill-opacity='0.05'%3E%3Cpath d='M30 30c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10S30 35.5 30 30zm-20 0c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10S10 35.5 10 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }
const card = {}
const btn = { padding: '13px 0', background: '#C9956C', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", display: 'block' }