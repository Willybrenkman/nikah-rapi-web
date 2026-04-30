// src/pages/Honeymoon.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useWedding } from '../hooks/useWedding'
import { confirmDelete } from '../lib/swal'
import toast from 'react-hot-toast'
import { syncService } from '../lib/syncService'

const rp = (n = 0) => 'Rp ' + Number(n).toLocaleString('id-ID')
const statusBadge = { Confirmed: 'badge-green', Pending: 'badge-yellow', Belum: 'badge-red' }

export default function Honeymoon() {
    const { wedding } = useWedding()
    const [info, setInfo] = useState({ destinasi: '', durasi: '', total_budget: '' })
    const [itinerary, setItinerary] = useState([])
    const [booking, setBooking] = useState([])

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [modalI, setModalI] = useState(false)
    const [modalB, setModalB] = useState(false)
    const [formI, setFormI] = useState({ hari: '', aktivitas: '', lokasi: '', estimasi_biaya: '' })
    const [formB, setFormB] = useState({ item: '', detail: '', harga: '', status: 'Belum' })
    const [editIId, setEditIId] = useState(null)
    const [editBId, setEditBId] = useState(null)

    useEffect(() => { if (wedding) fetchData() }, [wedding])

    const fetchData = async () => {
        setLoading(true)
        if (wedding.id === 'dummy-wedding-id') {
            setInfo({ destinasi: 'Maldives & Dubai', durasi: '10 Hari 9 Malam', total_budget: 75000000 })
            setItinerary([
                { id: 1, hari: 'Hari 1', aktivitas: 'Penerbangan Jakarta - Male & Speedboat ke Resort', lokasi: 'Velana Int. Airport', estimasi_biaya: 15000000 },
                { id: 2, hari: 'Hari 2', aktivitas: 'Snorkeling Safari & Private Sandbank Lunch', lokasi: 'Baa Atoll', estimasi_biaya: 5000000 },
                { id: 3, hari: 'Hari 3', aktivitas: 'Sunset Dolphin Cruise & Romantic Candle Light Dinner', lokasi: 'Overwater Villa', estimasi_biaya: 7500000 },
                { id: 4, hari: 'Hari 4', aktivitas: 'Spa Day & Relaxing at Private Pool', lokasi: 'Anantara Resort', estimasi_biaya: 3000000 },
                { id: 5, hari: 'Hari 5', aktivitas: 'Penerbangan ke Dubai & City Tour Malam Hari', lokasi: 'Burj Khalifa', estimasi_biaya: 10000000 },
            ])
            setBooking([
                { id: 1, item: 'Tiket Pesawat (Emirates)', detail: 'Business Class Jakarta - Male - Dubai', harga: 45000000, status: 'Confirmed' },
                { id: 2, item: 'Anantara Dhigu Maldives', detail: 'Sunrise Overwater Suite (4 Nights)', harga: 25000000, status: 'Confirmed' },
                { id: 3, item: 'Armani Hotel Dubai', detail: 'Deluxe Room (3 Nights)', harga: 15000000, status: 'Confirmed' },
                { id: 4, item: 'Desert Safari Tour', detail: 'Premium Desert Safari with BBQ Dinner', harga: 2500000, status: 'Pending' },
            ])
            setLoading(false)
            return
        }
        const [infoRes, itiRes, bookRes] = await Promise.all([
            supabase.from('honeymoon_info').select('*').eq('wedding_id', wedding.id).single(),
            supabase.from('honeymoon_itinerary').select('*').eq('wedding_id', wedding.id).order('created_at'),
            supabase.from('honeymoon_booking').select('*').eq('wedding_id', wedding.id).order('created_at')
        ])
        if (infoRes.data) setInfo(infoRes.data)
        setItinerary(itiRes.data || [])
        setBooking(bookRes.data || [])
        setLoading(false)
    }

    const saveInfo = async () => {
        setSaving(true)
        const payload = { ...info, total_budget: Number(info.total_budget) || 0, wedding_id: wedding.id }
        
        try {
            const { data } = await supabase.from('honeymoon_info').select('id').eq('wedding_id', wedding.id).single()
            if (data) await supabase.from('honeymoon_info').update(payload).eq('id', data.id)
            else await supabase.from('honeymoon_info').insert(payload)

            // --- INVERSE SYNC TO BUDGET ---
            await syncService.syncToBudget(
                wedding.id, 
                'honeymoon', 
                `Honeymoon: ${info.destinasi || 'TBA'}`, 
                payload.total_budget, 
                0
            )

            toast.success('Rencana & budget honeymoon disinkronkan! ✨')
            fetchData()
        } catch (error) {
            console.error(error)
            toast.error('Gagal sinkronisasi data')
        } finally {
            setSaving(false)
        }
    }

    const openAddI = () => { setFormI({ hari: '', aktivitas: '', lokasi: '', estimasi_biaya: '' }); setEditIId(null); setModalI(true) }
    const openEditI = (i) => { setFormI({ hari: i.hari, aktivitas: i.aktivitas, lokasi: i.lokasi, estimasi_biaya: i.estimasi_biaya }); setEditIId(i.id); setModalI(true) }

    const saveIti = async () => {
        setSaving(true)
        const payload = { ...formI, estimasi_biaya: Number(formI.estimasi_biaya) || 0, wedding_id: wedding.id }
        if (editIId) await supabase.from('honeymoon_itinerary').update(payload).eq('id', editIId)
        else await supabase.from('honeymoon_itinerary').insert(payload)
        toast.success('Itinerary disimpan!')
        setModalI(false); fetchData(); setSaving(false)
    }

    const handleDeleteItinerary = async (id) => {
        const result = await confirmDelete('Hapus itinerary ini?', 'Aktivitas ini akan dihapus permanen.')
        if (!result.isConfirmed) return
        await supabase.from('honeymoon_itinerary').delete().eq('id', id)
        toast.success('Itinerary dihapus!')
        fetchData()
    }

    const openAddB = () => { setFormB({ item: '', detail: '', harga: '', status: 'Belum' }); setEditBId(null); setModalB(true) }
    const openEditB = (b) => { setFormB({ item: b.item, detail: b.detail, harga: b.harga, status: b.status }); setEditBId(b.id); setModalB(true) }

    const saveBook = async () => {
        setSaving(true)
        const payload = { ...formB, harga: Number(formB.harga) || 0, wedding_id: wedding.id }
        if (editBId) await supabase.from('honeymoon_booking').update(payload).eq('id', editBId)
        else await supabase.from('honeymoon_booking').insert(payload)
        toast.success('Booking disimpan!')
        setModalB(false); fetchData(); setSaving(false)
    }

    const handleDeleteBooking = async (id) => {
        const result = await confirmDelete('Hapus booking ini?', 'Detail booking akan dihapus permanen.')
        if (!result.isConfirmed) return
        await supabase.from('honeymoon_booking').delete().eq('id', id)
        toast.success('Booking dihapus!')
        fetchData()
    }

    const totalBiaya = itinerary.reduce((sum, item) => sum + (Number(item.estimasi_biaya) || 0), 0)
    if (loading) return <div className="text-center py-20 text-brown-muted font-playfair italic">Mempersiapkan rencana bulan madu kalian...</div>

    return (
        <>
            <style>{`
            .btn-sm-delete {
                font-size: 9px;
                font-weight: 900;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                padding: 4px 10px;
                border-radius: 8px;
                background-color: #fef2f2;
                color: #ef4444;
                border: 1px solid #fee2e2;
                transition: all 0.2s;
                cursor: pointer;
            }
            .btn-sm-delete:hover {
                background-color: #ef4444;
                color: white;
            }
        `}</style>
            <div className="animate-fade-in pb-12">
                <div className="section-header">
                    <div>
                        <h1 className="section-title">Honeymoon Planner 🌙 <span className="badge-exclusive ml-2">✦ Romantis</span></h1>
                        <p className="section-subtitle">Rancang perjalanan bulan madu impian, kelola itinerary, dan pantau status booking</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="btn-outline px-6 py-2.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-2" onClick={openAddI}>
                            <span>+</span> Itinerary
                        </button>
                        <button className="btn-rose px-6 py-2.5 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-gold/20 flex items-center gap-2" onClick={openAddB}>
                            <span>+</span> Booking
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    <div className="stat-card hover:shadow-xl transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-rose-gold/10 flex items-center justify-center text-xl mb-4">✈️</div>
                        <div className="font-playfair text-xl font-bold text-brown leading-tight truncate">{info.destinasi || 'Belum Ditentukan'}</div>
                        <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Destinasi Impian</div>
                    </div>
                    <div className="stat-card hover:shadow-xl transition-all border-sage/20 shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-sage/10 flex items-center justify-center text-xl mb-4">📅</div>
                        <div className="font-playfair text-xl font-bold text-brown leading-tight">{info.durasi || '—'}</div>
                        <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Durasi Perjalanan</div>
                    </div>
                    <div className="stat-card hover:shadow-xl transition-all border-rose-gold/20 shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-rose-gold/5 flex items-center justify-center text-xl mb-4">💰</div>
                        <div className="font-playfair text-xl font-bold text-brown leading-tight">{rp(info.total_budget)}</div>
                        <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Alokasi Anggaran</div>
                    </div>
                </div>

                {/* Main Info */}
                <div className="card mb-10 shadow-sm border-ivory/50">
                    <div className="p-6 border-b border-border bg-ivory/5 flex justify-between items-center">
                        <div>
                            <h2 className="font-playfair text-xl font-bold text-brown">Konfigurasi Rencana</h2>
                            <p className="text-[10px] font-bold text-brown-muted uppercase tracking-widest mt-1">Tentukan destinasi dan anggaran dasar</p>
                        </div>
                    </div>
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                            <div className="form-group">
                                <label className="form-label">Tujuan / Destinasi</label>
                                <input className="form-input shadow-inner-white" placeholder="cth: Ubud - Bali, Maldives" value={info.destinasi} onChange={e => setInfo(p => ({ ...p, destinasi: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Durasi (Hari & Malam)</label>
                                <input className="form-input shadow-inner-white" placeholder="cth: 5 Hari 4 Malam" value={info.durasi} onChange={e => setInfo(p => ({ ...p, durasi: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Estimasi Total Budget (Rp)</label>
                                <input type="number" className="form-input shadow-inner-white" value={info.total_budget} onChange={e => setInfo(p => ({ ...p, total_budget: e.target.value }))} />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button className="btn-rose px-12 py-3 text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-gold/20" onClick={saveInfo}>Simpan Perubahan</button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    {/* Itinerary */}
                    <div className="card p-0 overflow-hidden shadow-sm border-ivory/50">
                        <div className="p-6 border-b border-border bg-ivory/5 flex justify-between items-center">
                            <div>
                                <h2 className="font-playfair text-lg font-bold text-brown">Rencana Aktivitas</h2>
                                <p className="text-[10px] font-bold text-brown-muted uppercase tracking-widest mt-1">Urutan kegiatan harian</p>
                            </div>
                            <span className="text-[10px] font-black text-rose-gold uppercase tracking-widest bg-rose-gold/5 px-3 py-1 rounded-lg border border-rose-gold/10 shadow-sm">Est. {rp(totalBiaya)}</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table>
                                <thead>
                                    <tr>
                                        <th className="th w-20 text-center">Hari</th>
                                        <th className="th">Aktivitas & Lokasi</th>
                                        <th className="th">Biaya</th>
                                        <th className="th text-right pr-6">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itinerary.length === 0 ? (
                                        <tr><td colSpan={4} className="td text-center py-20 text-brown-muted italic font-medium">Belum ada rincian itinerary harian.</td></tr>
                                    ) : itinerary.map(i => (
                                        <tr key={i.id} className="tr group transition-all hover:bg-ivory/10">
                                            <td className="td text-center">
                                                <span className="inline-block text-[10px] font-black text-rose-gold bg-rose-gold/5 px-2 py-1 rounded-lg border border-rose-gold/10">{i.hari}</span>
                                            </td>
                                            <td className="td">
                                                <div className="font-bold text-brown group-hover:text-rose-gold transition-colors">{i.aktivitas}</div>
                                                <div className="text-[10px] text-brown-muted font-medium italic mt-0.5 flex items-center gap-1.5">
                                                    <span className="text-rose-gold">📍</span> {i.lokasi || 'Lokasi belum ditentukan'}
                                                </div>
                                            </td>
                                            <td className="td font-black text-brown text-xs">{rp(i.estimasi_biaya)}</td>
                                            <td className="td text-right pr-6">
                                                <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-all">
                                                    <button className="btn-sm-edit shadow-sm" onClick={() => openEditI(i)}>Edit</button>
                                                    <button className="btn-sm-delete shadow-sm" onClick={() => deleteIti(i.id)}>Hapus</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Bookings */}
                    <div className="card p-0 overflow-hidden shadow-sm border-ivory/50">
                        <div className="p-6 border-b border-border bg-ivory/5">
                            <h2 className="font-playfair text-lg font-bold text-brown">Status Pemesanan</h2>
                            <p className="text-[10px] font-bold text-brown-muted uppercase tracking-widest mt-1">Akomodasi, tiket, dan transportasi</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table>
                                <thead>
                                    <tr>
                                        <th className="th">Item Booking</th>
                                        <th className="th">Harga</th>
                                        <th className="th">Status</th>
                                        <th className="th text-right pr-6">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {booking.length === 0 ? (
                                        <tr><td colSpan={4} className="td text-center py-20 text-brown-muted italic font-medium">Belum ada data pemesanan yang tercatat.</td></tr>
                                    ) : booking.map(b => (
                                        <tr key={b.id} className="tr group transition-all hover:bg-ivory/10">
                                            <td className="td">
                                                <div className="font-bold text-brown group-hover:text-rose-gold transition-colors">{b.item}</div>
                                                <div className="text-[10px] text-brown-muted font-medium italic mt-0.5">{b.detail || '—'}</div>
                                            </td>
                                            <td className="td font-black text-brown text-xs">{rp(b.harga)}</td>
                                            <td className="td">
                                                <span className={`badge ${statusBadge[b.status] || 'badge-grey'} text-[9px] font-black uppercase tracking-widest px-3 py-1 shadow-sm`}>
                                                    {b.status === 'Confirmed' ? '✅ Terkonfirmasi' : b.status === 'Pending' ? '⏳ Menunggu' : '❌ Belum'}
                                                </span>
                                            </td>
                                            <td className="td text-right pr-6">
                                                <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-all">
                                                    <button className="btn-sm-edit shadow-sm" onClick={() => openEditB(b)}>Edit</button>
                                                    <button className="btn-sm-delete shadow-sm" onClick={() => deleteBook(b.id)}>Hapus</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Itinerary Modal */}
                {modalI && (
                    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModalI(false)}>
                        <div className="modal-box max-w-md">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="font-playfair text-2xl font-bold text-brown">
                                        {editIId ? 'Edit' : 'Tambah'} Itinerary
                                    </h2>
                                    <p className="text-[10px] font-bold text-brown-muted uppercase tracking-widest mt-1">Detail rencana kegiatan harian</p>
                                </div>
                                <button onClick={() => setModalI(false)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-ivory text-brown-muted transition-colors border border-transparent hover:border-border">✕</button>
                            </div>

                            <div className="space-y-5">
                                <div className="form-group">
                                    <label className="form-label">Urutan Hari (cth: Hari 1)</label>
                                    <input className="form-input shadow-inner-white" placeholder="Masukkan keterangan hari..." value={formI.hari} onChange={e => setFormI(p => ({ ...p, hari: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Nama Aktivitas / Kegiatan</label>
                                    <input className="form-input shadow-inner-white" placeholder="cth: Candle Light Dinner, Snorkeling..." value={formI.aktivitas} onChange={e => setFormI(p => ({ ...p, aktivitas: e.target.value }))} />
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="form-group">
                                        <label className="form-label">Lokasi / Venue</label>
                                        <input className="form-input shadow-inner-white" placeholder="Nama tempat..." value={formI.lokasi} onChange={e => setFormI(p => ({ ...p, lokasi: e.target.value }))} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Est. Biaya (Rp)</label>
                                        <input type="number" className="form-input shadow-inner-white" value={formI.estimasi_biaya} onChange={e => setFormI(p => ({ ...p, estimasi_biaya: e.target.value }))} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 justify-end mt-10 pt-8 border-t border-border">
                                <button className="btn-outline px-8 py-3 text-xs font-bold uppercase tracking-widest" onClick={() => setModalI(false)}>Batal</button>
                                <button className="btn-rose px-10 py-3 text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-gold/20" onClick={saveIti} disabled={saving}>
                                    {saving ? 'Menyimpan...' : 'Simpan Rencana'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Booking Modal */}
                {modalB && (
                    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModalB(false)}>
                        <div className="modal-box max-w-md">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="font-playfair text-2xl font-bold text-brown">
                                        {editBId ? 'Edit' : 'Tambah'} Booking
                                    </h2>
                                    <p className="text-[10px] font-bold text-brown-muted uppercase tracking-widest mt-1">Detail pemesanan akomodasi & tiket</p>
                                </div>
                                <button onClick={() => setModalB(false)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-ivory text-brown-muted transition-colors border border-transparent hover:border-border">✕</button>
                            </div>

                            <div className="space-y-5">
                                <div className="form-group">
                                    <label className="form-label">Nama Item Booking</label>
                                    <input className="form-input shadow-inner-white" placeholder="cth: Tiket Pesawat, Resort, Sewa Mobil..." value={formB.item} onChange={e => setFormB(p => ({ ...p, item: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Detail Deskripsi</label>
                                    <input className="form-input shadow-inner-white" placeholder="cth: Garuda Indonesia GA-402, Villa Deluxe..." value={formB.detail} onChange={e => setFormB(p => ({ ...p, detail: e.target.value }))} />
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="form-group">
                                        <label className="form-label">Harga Total (Rp)</label>
                                        <input type="number" className="form-input shadow-inner-white" value={formB.harga} onChange={e => setFormB(p => ({ ...p, harga: e.target.value }))} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Status Reservasi</label>
                                        <select className="form-select shadow-inner-white" value={formB.status} onChange={e => setFormB(p => ({ ...p, status: e.target.value }))}>
                                            <option value="Belum">Belum Dibooking</option>
                                            <option value="Pending">Sedang Diproses</option>
                                            <option value="Confirmed">Terkonfirmasi (OK)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 justify-end mt-10 pt-8 border-t border-border">
                                <button className="btn-outline px-8 py-3 text-xs font-bold uppercase tracking-widest" onClick={() => setModalB(false)}>Batal</button>
                                <button className="btn-rose px-10 py-3 text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-gold/20" onClick={saveBook} disabled={saving}>
                                    {saving ? 'Menyimpan...' : 'Simpan Booking'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}