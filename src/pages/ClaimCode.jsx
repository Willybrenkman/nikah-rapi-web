// src/pages/ClaimCode.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'

export default function ClaimCode() {
    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(false)
    const { user, refreshAccess } = useAuth()
    const navigate = useNavigate()

    const handleClaim = async (e) => {
        e.preventDefault()
        if (!code) { toast.error('Masukkan kode akses dulu!'); return }
        if (!user) { toast.error('Sesi berakhir, silakan login ulang.'); return }
        
        setLoading(true)
        
        // Cek apakah kode valid dan belum dipakai
        const { data, error: fetchError } = await supabase
            .from('access_codes')
            .select('*')
            .eq('code', code)
            .single()
            
        if (fetchError || !data) {
            toast.error('Kode tidak valid atau tidak ditemukan!')
            setLoading(false)
            return
        }
        
        if (data.is_used) {
            toast.error('Kode voucher ini sudah pernah dipakai!')
            setLoading(false)
            return
        }
        
        // Update kode menjadi sudah dipakai oleh user ini
        const { error: updateError } = await supabase
            .from('access_codes')
            .update({ is_used: true, used_by: user.id })
            .eq('id', data.id)
            
        if (updateError) {
            toast.error('Terjadi kesalahan. Silakan coba lagi.')
            setLoading(false)
            return
        }
        
        toast.success('Kode berhasil diklaim! Selamat menggunakan Nikah Rapi 💍')
        await refreshAccess()
        navigate('/')
    }

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#FDFAF6', position: 'relative', overflow: 'hidden',
        }}>
            {/* Radial bg */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: `
          radial-gradient(circle at 20% 20%, rgba(201,149,108,.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(232,196,184,.12) 0%, transparent 50%)
        `,
            }} />

            {/* Floral pattern */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9956C' fill-opacity='0.05'%3E%3Cpath d='M30 30c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10S30 35.5 30 30zm-20 0c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10S10 35.5 10 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />

            {/* Card */}
            <div className="animate-fade-up auth-card" style={{ zIndex: 1, padding: '40px 30px', maxWidth: 400, width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: '#C9956C', letterSpacing: 1 }}>
                        Aktivasi Akses ✦
                    </h1>
                    <p style={{ fontSize: 14, color: '#9B8070', marginTop: 8, lineHeight: 1.5 }}>
                        Silakan masukkan kode voucher yang Anda dapatkan setelah pembelian di Scalev.
                    </p>
                </div>

                <form onSubmit={handleClaim}>
                    <div style={{ marginBottom: 20 }}>
                        <label className="form-label">Kode Voucher</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Contoh: NR-XXXX"
                            value={code}
                            onChange={e => setCode(e.target.value.toUpperCase())}
                            style={{ textTransform: 'uppercase', letterSpacing: 2, textAlign: 'center', fontSize: 18 }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%', padding: 13, background: loading ? '#d4a882' : '#C9956C',
                            color: '#fff', border: 'none', borderRadius: 10,
                            fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'background .2s', fontFamily: "'DM Sans',sans-serif",
                        }}
                    >
                        {loading ? 'Memvalidasi...' : 'Klaim Kode Sekarang'}
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => supabase.auth.signOut()}
                        style={{
                            width: '100%', padding: 13, background: 'transparent',
                            color: '#9B8070', border: 'none',
                            fontSize: 14, fontWeight: 500, cursor: 'pointer',
                            marginTop: 8, fontFamily: "'DM Sans',sans-serif",
                            textDecoration: 'underline'
                        }}
                    >
                        Keluar Akun / Ganti Email
                    </button>
                </form>
            </div>
        </div>
    )
}
