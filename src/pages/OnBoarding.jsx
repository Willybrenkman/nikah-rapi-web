// src/pages/OnBoarding.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useWedding } from '../hooks/useWedding'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

const STEPS = [
    { id: 1, icon: '💍', title: 'Data Pasangan', sub: 'Siapa nama kalian berdua?' },
    { id: 2, icon: '📅', title: 'Hari Pernikahan', sub: 'Kapan hari bahagia kalian?' },
    { id: 3, icon: '💰', title: 'Budget Pernikahan', sub: 'Berapa total budget yang disiapkan?' },
]

const F = ({ label, children }) => (
    <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#2C1810', marginBottom: 6 }}>{label}</label>
        {children}
    </div>
)

export default function OnBoarding() {
    const navigate = useNavigate()
    const { refetch } = useWedding()
    const { user } = useAuth()
    const [step, setStep] = useState(1)
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState({
        nama_pengantin_1: '', nama_pengantin_2: '',
        tanggal_pernikahan: '', lokasi_akad: '', lokasi_resepsi: '',
        total_budget: '',
    })

    const handleNext = () => {
        if (step === 1 && (!form.nama_pengantin_1 || !form.nama_pengantin_2)) {
            toast.error('Isi nama kedua pengantin dulu!'); return
        }
        if (step === 2 && !form.tanggal_pernikahan) {
            toast.error('Tanggal pernikahan wajib diisi!'); return
        }
        setStep(s => s + 1)
    }

    const handleFinish = async () => {
        if (!form.total_budget) { toast.error('Isi budget pernikahan dulu!'); return }
        setSaving(true)
        const { error } = await supabase.from('wedding_profiles').insert({
            user_id: user.id,
            nama_pengantin_1: form.nama_pengantin_1,
            nama_pengantin_2: form.nama_pengantin_2,
            tanggal_pernikahan: form.tanggal_pernikahan,
            lokasi_akad: form.lokasi_akad,
            lokasi_resepsi: form.lokasi_resepsi,
            total_budget: Number(form.total_budget) || 0,
        })
        if (error) {
            toast.error('Gagal menyimpan profil. Coba lagi!'); setSaving(false); return
        }
        await refetch()
        toast.success('Profil pernikahan berhasil dibuat! 🎉')
        navigate('/', { replace: true })
        setSaving(false)
    }

    const nama1 = form.nama_pengantin_1.split(' ')[0] || 'Kamu'
    const nama2 = form.nama_pengantin_2.split(' ')[0] || 'Pasangan'

    return (
        <div style={{ minHeight: '100vh', background: '#FDFAF6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative' }}>
            {/* Background */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 15% 15%, rgba(201,149,108,.06) 0%, transparent 50%), radial-gradient(circle at 85% 85%, rgba(232,196,184,.1) 0%, transparent 50%)`, pointerEvents: 'none' }} />

            <div style={{ width: '100%', maxWidth: 520, position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, color: '#C9956C', fontWeight: 700, marginBottom: 4 }}>NIKAH RAPI ✦</div>
                    <div style={{ fontSize: 14, color: '#9B8070' }}>Mari setup profil pernikahan kamu 💍</div>
                </div>

                {/* Step indicator */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32, gap: 0 }}>
                    {STEPS.map((s, i) => (
                        <div key={s.id} style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 16, fontWeight: 700, transition: 'all .3s',
                                background: step >= s.id ? '#C9956C' : '#F0E6DF',
                                color: step >= s.id ? '#fff' : '#9B8070',
                                boxShadow: step === s.id ? '0 4px 12px rgba(201,149,108,.4)' : 'none',
                            }}>
                                {step > s.id ? '✓' : s.id}
                            </div>
                            {i < STEPS.length - 1 && (
                                <div style={{ width: 60, height: 2, background: step > s.id ? '#C9956C' : '#F0E6DF', transition: 'background .3s' }} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Card */}
                <div style={{ background: '#fff', borderRadius: 24, padding: '40px 44px', boxShadow: '0 8px 48px rgba(201,149,108,.12)' }} className="animate-fade-in">
                    {/* Step icon + title */}
                    <div style={{ textAlign: 'center', marginBottom: 28 }}>
                        <div style={{ fontSize: 48, marginBottom: 12 }}>{STEPS[step - 1].icon}</div>
                        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: '#2C1810', marginBottom: 4 }}>{STEPS[step - 1].title}</div>
                        <div style={{ fontSize: 14, color: '#9B8070' }}>{STEPS[step - 1].sub}</div>
                    </div>

                    {/* Step 1: Nama */}
                    {step === 1 && (
                        <div>
                            <F label="Nama Pengantin 1 (Wanita)">
                                <input className="form-input" placeholder="cth: Anisa Rahmadani" value={form.nama_pengantin_1} onChange={e => setForm(p => ({ ...p, nama_pengantin_1: e.target.value }))} />
                            </F>
                            <div style={{ textAlign: 'center', fontSize: 20, margin: '8px 0', color: '#C9956C', fontFamily: "'Playfair Display',serif" }}>&</div>
                            <F label="Nama Pengantin 2 (Pria)">
                                <input className="form-input" placeholder="cth: Rizky Pratama" value={form.nama_pengantin_2} onChange={e => setForm(p => ({ ...p, nama_pengantin_2: e.target.value }))} />
                            </F>
                            {form.nama_pengantin_1 && form.nama_pengantin_2 && (
                                <div style={{ background: 'rgba(201,149,108,.08)', border: '1px solid #F0E6DF', borderRadius: 12, padding: '12px 16px', textAlign: 'center', marginTop: 8 }}>
                                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: '#C9956C' }}>{nama1} & {nama2} 💍</div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Tanggal */}
                    {step === 2 && (
                        <div>
                            <F label="Tanggal Pernikahan">
                                <input type="date" className="form-input" value={form.tanggal_pernikahan} onChange={e => setForm(p => ({ ...p, tanggal_pernikahan: e.target.value }))} min={new Date().toISOString().split('T')[0]} />
                            </F>
                            {form.tanggal_pernikahan && (
                                <div style={{ background: 'rgba(201,149,108,.08)', border: '1px solid #F0E6DF', borderRadius: 12, padding: '12px 16px', textAlign: 'center', marginBottom: 16 }}>
                                    <div style={{ fontSize: 13, color: '#9B8070', marginBottom: 4 }}>Hari Bahagia</div>
                                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: '#2C1810' }}>
                                        {new Date(form.tanggal_pernikahan).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>
                                    <div style={{ fontSize: 13, color: '#C9956C', fontWeight: 600, marginTop: 4 }}>
                                        H-{Math.max(0, Math.ceil((new Date(form.tanggal_pernikahan) - new Date()) / 86_400_000))} hari lagi 💍
                                    </div>
                                </div>
                            )}
                            <F label="Lokasi Akad (opsional)">
                                <input className="form-input" placeholder="cth: Masjid Al-Ikhlas, Jakarta Selatan" value={form.lokasi_akad} onChange={e => setForm(p => ({ ...p, lokasi_akad: e.target.value }))} />
                            </F>
                            <F label="Lokasi Resepsi (opsional)">
                                <input className="form-input" placeholder="cth: Majestic Venue, Jakarta" value={form.lokasi_resepsi} onChange={e => setForm(p => ({ ...p, lokasi_resepsi: e.target.value }))} />
                            </F>
                        </div>
                    )}

                    {/* Step 3: Budget */}
                    {step === 3 && (
                        <div>
                            <F label="Total Budget Pernikahan (Rp)">
                                <input type="number" className="form-input" placeholder="cth: 85000000" value={form.total_budget} onChange={e => setForm(p => ({ ...p, total_budget: e.target.value }))} />
                            </F>
                            {form.total_budget && (
                                <div style={{ background: 'rgba(201,149,108,.08)', border: '1px solid #F0E6DF', borderRadius: 12, padding: '12px 16px', textAlign: 'center', marginBottom: 16 }}>
                                    <div style={{ fontSize: 13, color: '#9B8070', marginBottom: 4 }}>Total Budget</div>
                                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: '#2C1810', fontWeight: 700 }}>
                                        Rp {Number(form.total_budget).toLocaleString('id-ID')}
                                    </div>
                                </div>
                            )}
                            <div style={{ background: 'rgba(139,175,139,.08)', border: '1px solid rgba(139,175,139,.3)', borderRadius: 12, padding: '16px 20px' }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#5a8a5a', marginBottom: 8 }}>✨ Hampir selesai!</div>
                                <div style={{ fontSize: 13, color: '#9B8070', lineHeight: 1.7 }}>
                                    Setelah ini kamu bisa mulai tracking:<br />
                                    💰 Budget per kategori<br />
                                    👥 Daftar tamu & RSVP<br />
                                    🤝 Vendor & timeline<br />
                                    📦 Seserahan & kado
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation buttons */}
                    <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
                        {step > 1 && (
                            <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, padding: '12px 0', background: 'transparent', border: '1.5px solid #F0E6DF', borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: 'pointer', color: '#9B8070', fontFamily: "'DM Sans',sans-serif" }}>
                                ← Kembali
                            </button>
                        )}
                        {step < STEPS.length ? (
                            <button onClick={handleNext} style={{ flex: 2, padding: '13px 0', background: '#C9956C', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
                                Lanjut →
                            </button>
                        ) : (
                            <button onClick={handleFinish} disabled={saving} style={{ flex: 2, padding: '13px 0', background: saving ? '#d4a882' : '#C9956C', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
                                {saving ? 'Menyimpan...' : 'Mulai Rencanakan! 💍'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <p style={{ textAlign: 'center', fontSize: 12, color: '#9B8070', marginTop: 20 }}>
                    Bisa diubah kapan saja di halaman Pengaturan
                </p>
            </div>
        </div>
    )
}