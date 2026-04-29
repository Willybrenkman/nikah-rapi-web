// src/pages/KadoAngpao.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useWedding } from '../hooks/useWedding'
import toast from 'react-hot-toast'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const rp = (n = 0) => 'Rp ' + Number(n).toLocaleString('id-ID')
const EMPTY = { nama: '', hubungan: 'Keluarga', jenis: 'Angpao', nominal: '', deskripsi_kado: '', sesi: 'Resepsi', sudah_ucapkan: false, catatan: '' }
const jenisBadge = { Angpao: 'badge-green', Kado: 'badge-blue', Keduanya: 'badge-rose' }

export default function KadoAngpao() {
    const { wedding } = useWedding()
    const [items, setItems] = useState([])
    const [filter, setFilter] = useState('Semua')
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [form, setForm] = useState(EMPTY)
    const [editId, setEditId] = useState(null)
    const [saving, setSaving] = useState(false)

    useEffect(() => { if (wedding) fetchItems() }, [wedding])

    const fetchItems = async () => {
        setLoading(true)
        const { data } = await supabase.from('kado_angpao').select('*').eq('wedding_id', wedding.id).order('created_at')
        setItems(data || [])
        setLoading(false)
    }

    const openAdd = () => { setForm(EMPTY); setEditId(null); setModal(true) }
    const openEdit = (i) => {
        setForm({ nama: i.nama, hubungan: i.hubungan, jenis: i.jenis, nominal: i.nominal || '', deskripsi_kado: i.deskripsi_kado || '', sesi: i.sesi, sudah_ucapkan: i.sudah_ucapkan || false, catatan: i.catatan || '' })
        setEditId(i.id); setModal(true)
    }

    const handleSave = async () => {
        if (!form.nama) { toast.error('Nama pemberi wajib diisi!'); return }
        setSaving(true)
        const payload = { ...form, nominal: Number(form.nominal) || 0, wedding_id: wedding.id }
        if (editId) { await supabase.from('kado_angpao').update(payload).eq('id', editId); toast.success('Data diperbarui!') }
        else { await supabase.from('kado_angpao').insert(payload); toast.success('Data ditambahkan!') }
        setModal(false); fetchItems(); setSaving(false)
    }

    const handleDelete = async (id) => {
        if (!confirm('Hapus data ini?')) return
        await supabase.from('kado_angpao').delete().eq('id', id)
        toast.success('Dihapus!'); fetchItems()
    }

    const toggleUcapkan = async (item) => {
        await supabase.from('kado_angpao').update({ sudah_ucapkan: !item.sudah_ucapkan }).eq('id', item.id)
        fetchItems()
    }

    const displayed = filter === 'Semua' ? items : items.filter(i => filter === 'Akad' || filter === 'Resepsi' ? i.sesi === filter : i.jenis === filter)
    const totalAngpao = items.filter(i => i.jenis !== 'Kado').reduce((a, i) => a + (i.nominal || 0), 0)
    const belumUcapkan = items.filter(i => !i.sudah_ucapkan).length
    const akadTotal = items.filter(i => i.sesi === 'Akad').reduce((a, i) => a + (i.nominal || 0), 0)
    const resepsiTotal = items.filter(i => i.sesi === 'Resepsi').reduce((a, i) => a + (i.nominal || 0), 0)

    if (loading && items.length === 0) return <div className="text-center py-20 text-brown-muted font-playfair italic">Menganalisa catatan kado & angpao kalian...</div>

    return (
        <div className="animate-fade-in pb-12">
            <div className="section-header">
                <div>
                    <h1 className="section-title">Kado & Angpao 🎁 <span className="badge-exclusive ml-2">✦ Eksklusif</span></h1>
                    <p className="section-subtitle">Rekap pemberian tamu, manajemen angpao, dan pelacakan ucapan terima kasih</p>
                </div>
                <button className="btn-rose px-8 shadow-lg shadow-rose-gold/20 flex items-center gap-2" onClick={openAdd}>
                    <span>+</span> Tambah Data Pemberian
                </button>
            </div>

            {belumUcapkan > 0 && (
                <div className="bg-rose-gold/5 border border-rose-gold/20 text-brown px-8 py-5 rounded-3xl mb-10 flex items-center justify-between shadow-sm animate-pulse-subtle">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-rose-gold/10 flex items-center justify-center text-2xl shadow-inner-white">💌</div>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 text-rose-gold">Tindak Lanjut Diperlukan</div>
                            <p className="text-sm font-bold">Ada {belumUcapkan} tamu yang belum dikirimi ucapan terima kasih.</p>
                        </div>
                    </div>
                    <button className="text-[10px] font-black uppercase tracking-widest text-rose-gold hover:bg-rose-gold hover:text-white px-4 py-2 rounded-xl transition-all border border-rose-gold/20" onClick={() => setFilter('Belum Ucapkan')}>Lihat Semua</button>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <div className="stat-card hover:shadow-xl transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-sage/10 flex items-center justify-center text-xl mb-4">💵</div>
                    <div className="font-playfair text-2xl font-bold text-brown leading-tight">{rp(totalAngpao)}</div>
                    <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Total Angpao Tunai</div>
                </div>
                <div className="stat-card hover:shadow-xl transition-all border-rose-gold/20 shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-rose-gold/10 flex items-center justify-center text-xl mb-4">🎁</div>
                    <div className="font-playfair text-2xl font-bold text-brown leading-tight">{items.length}</div>
                    <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Total Pemberi (Item/Tunai)</div>
                </div>
                <div className="stat-card hover:shadow-xl transition-all border-danger/10 shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-danger/5 flex items-center justify-center text-xl mb-4">📱</div>
                    <div className="font-playfair text-2xl font-bold text-brown leading-tight">{belumUcapkan}</div>
                    <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Belum Follow Up Ucapan</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-10">
                <div className="card lg:col-span-3 shadow-sm border-ivory/50">
                    <div className="p-6 border-b border-border bg-ivory/5">
                        <h2 className="font-playfair text-xl font-bold text-brown">Akumulasi Angpao per Sesi</h2>
                    </div>
                    <div className="p-8 h-[320px]">
                        <Bar 
                            data={{ 
                                labels: ['Akad Nikah', 'Resepsi Pernikahan'], 
                                datasets: [{ 
                                    label: 'Total Nominal (Rp)', 
                                    data: [akadTotal, resepsiTotal], 
                                    backgroundColor: ['#C9956C80', '#E8C4B8CC'], 
                                    hoverBackgroundColor: ['#C9956C', '#E8C4B8'],
                                    borderRadius: 16,
                                    barThickness: 40
                                }] 
                            }}
                            options={{ 
                                responsive: true, 
                                maintainAspectRatio: false, 
                                plugins: { 
                                    legend: { display: false },
                                    tooltip: {
                                        backgroundColor: '#5D4037',
                                        titleFont: { size: 12, family: "'Playfair Display', serif" },
                                        bodyFont: { size: 12, family: "'DM Sans', sans-serif" },
                                        padding: 12,
                                        cornerRadius: 12,
                                        callbacks: {
                                            label: (ctx) => `Total: ${rp(ctx.raw)}`
                                        }
                                    }
                                }, 
                                scales: { 
                                    y: { beginAtZero: true, grid: { color: '#F0E6DF', drawBorder: false }, ticks: { font: { size: 10, weight: '600' }, color: '#8D6E63' } }, 
                                    x: { grid: { display: false }, ticks: { font: { size: 11, weight: '800' }, color: '#5D4037' } } 
                                } 
                            }} 
                        />
                    </div>
                </div>
                <div className="card lg:col-span-2 shadow-sm border-ivory/50">
                    <div className="p-6 border-b border-border bg-ivory/5">
                        <h2 className="font-playfair text-xl font-bold text-brown">Komposisi Pemberian</h2>
                    </div>
                    <div className="p-8 h-[320px]">
                        <Doughnut 
                            data={{
                                labels: ['Angpao Tunai', 'Kado Fisik', 'Keduanya'],
                                datasets: [{ 
                                    data: [
                                        items.filter(i => i.jenis === 'Angpao').length, 
                                        items.filter(i => i.jenis === 'Kado').length, 
                                        items.filter(i => i.jenis === 'Keduanya').length
                                    ], 
                                    backgroundColor: ['#C9956C', '#8BAF8B', '#E8C4B8'], 
                                    borderWidth: 0,
                                    hoverOffset: 20
                                }]
                            }} 
                            options={{ 
                                responsive: true, 
                                maintainAspectRatio: false, 
                                cutout: '75%', 
                                plugins: { 
                                    legend: { 
                                        position: 'bottom', 
                                        labels: { 
                                            font: { size: 10, family: "'DM Sans', sans-serif", weight: '800' }, 
                                            color: '#5D4037',
                                            usePointStyle: true,
                                            padding: 20,
                                            pointStyleWidth: 8
                                        } 
                                    },
                                    tooltip: {
                                        backgroundColor: '#5D4037',
                                        padding: 12,
                                        cornerRadius: 12,
                                        titleFont: { size: 11 },
                                        bodyFont: { size: 12, weight: 'bold' }
                                    }
                                } 
                            }} 
                        />
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div className="mb-8 flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                {['Semua', 'Kado', 'Angpao', 'Keduanya', 'Akad', 'Resepsi'].map(f => (
                    <button 
                        key={f} 
                        className={`filter-btn whitespace-nowrap px-8 py-3 text-[10px] uppercase font-black tracking-widest transition-all ${filter === f ? 'active ring-4 ring-rose-gold/5 shadow-md shadow-rose-gold/10' : 'bg-white text-brown-muted hover:bg-ivory/50 border border-ivory/50 shadow-sm'}`} 
                        onClick={() => setFilter(f)}
                    >
                        {f === 'Semua' ? 'Semua Data' : f}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="card p-0 overflow-hidden group/table shadow-sm border-ivory/50">
                <div className="p-6 border-b border-border bg-ivory/5 flex items-center justify-between">
                    <h2 className="font-playfair text-xl font-bold text-brown">Rincian Data Pemberian</h2>
                    <span className="text-[10px] font-bold text-brown-muted uppercase tracking-widest italic">{displayed.length} Catatan Terdaftar</span>
                </div>
                <div className="overflow-x-auto">
                    <table>
                        <thead>
                            <tr>
                                <th className="th w-16 text-center">No</th>
                                <th className="th">Nama Lengkap Pemberi</th>
                                <th className="th">Hubungan</th>
                                <th className="th">Jenis</th>
                                <th className="th">Nominal / Detail Kado</th>
                                <th className="th">Sesi Acara</th>
                                <th className="th text-center">Follow Up</th>
                                <th className="th text-right pr-8">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayed.length === 0 ? (
                                <tr><td colSpan={8} className="td text-center py-32 text-brown-muted italic font-medium">Belum ada data kado atau angpao yang tercatat. Mari mulai rekap momen berbagi kalian!</td></tr>
                            ) : displayed.map((item, i) => (
                                <tr key={item.id} className="tr group transition-all hover:bg-ivory/10">
                                    <td className="td text-center text-[10px] text-brown-muted/60 font-black tracking-widest">{String(i + 1).padStart(2, '0')}</td>
                                    <td className="td font-bold text-brown group-hover:text-rose-gold transition-colors">{item.nama}</td>
                                    <td className="td">
                                        <span className="text-[10px] font-black text-brown-muted uppercase tracking-[0.1em] italic">{item.hubungan}</span>
                                    </td>
                                    <td className="td">
                                        <span className={`badge ${jenisBadge[item.jenis] || 'badge-grey'} text-[9px] font-black uppercase tracking-tighter px-3 shadow-sm`}>{item.jenis}</span>
                                    </td>
                                    <td className="td">
                                        {item.jenis !== 'Kado' ? (
                                            <div className="text-[11px] font-black text-brown bg-sage/5 px-2 py-1 rounded-lg border border-sage/10 w-fit">{rp(item.nominal)}</div>
                                        ) : (
                                            <div className="text-[10px] text-brown font-bold italic flex items-center gap-2">
                                                <span className="text-rose-gold">🎁</span> {item.deskripsi_kado || '—'}
                                            </div>
                                        )}
                                        {item.jenis === 'Keduanya' && (
                                            <div className="text-[9px] text-rose-gold/70 font-bold mt-2 uppercase tracking-tighter flex items-center gap-1.5 pl-1">
                                                <span className="w-1 h-1 rounded-full bg-rose-gold animate-pulse"></span>
                                                Kado: {item.deskripsi_kado}
                                            </div>
                                        )}
                                    </td>
                                    <td className="td">
                                        <span className="badge-rose text-[9px] px-3 py-1 uppercase font-black tracking-tighter opacity-80 shadow-sm">{item.sesi}</span>
                                    </td>
                                    <td className="td text-center">
                                        <button onClick={() => toggleUcapkan(item)} className="hover:scale-110 transition-all active:scale-95">
                                            {item.sudah_ucapkan ? (
                                                <span className="badge badge-green flex items-center gap-1.5 text-[9px] font-black px-4 py-1.5 shadow-sm uppercase tracking-tighter">✅ Selesai</span>
                                            ) : (
                                                <span className="badge badge-red flex items-center gap-1.5 text-[9px] font-black px-4 py-1.5 shadow-sm uppercase tracking-tighter">⏳ Perlu WA</span>
                                            )}
                                        </button>
                                    </td>
                                    <td className="td text-right pr-8">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                            <button className="btn-sm-edit shadow-sm" onClick={() => openEdit(item)}>Edit</button>
                                            <button className="btn-sm-danger p-1 shadow-sm" onClick={() => handleDelete(item.id)}>✕</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {modal && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
                    <div className="modal-box max-w-md">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="font-playfair text-2xl font-bold text-brown">
                                    {editId ? 'Edit' : 'Tambah'} Catatan
                                </h2>
                                <p className="text-[10px] font-bold text-brown-muted uppercase tracking-widest mt-1">Detail rincian kado & angpao tamu</p>
                            </div>
                            <button onClick={() => setModal(false)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-ivory text-brown-muted transition-colors border border-transparent hover:border-border">✕</button>
                        </div>
                        
                        <div className="space-y-5">
                            <div className="form-group">
                                <label className="form-label">Nama Lengkap Pemberi</label>
                                <input className="form-input shadow-inner-white" placeholder="Masukkan nama lengkap tamu..." value={form.nama} onChange={e => setForm(p => ({ ...p, nama: e.target.value }))} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label">Kategori Hubungan</label>
                                    <select className="form-select shadow-inner-white" value={form.hubungan} onChange={e => setForm(p => ({ ...p, hubungan: e.target.value }))}>
                                        {['Keluarga', 'Teman', 'Kolega', 'Sahabat', 'Tetangga'].map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Jenis Pemberian</label>
                                    <select className="form-select shadow-inner-white" value={form.jenis} onChange={e => setForm(p => ({ ...p, jenis: e.target.value }))}>
                                        <option value="Angpao">Hanya Angpao Tunai</option>
                                        <option value="Kado">Hanya Kado Fisik</option>
                                        <option value="Keduanya">Angpao + Kado</option>
                                    </select>
                                </div>
                            </div>
                            {(form.jenis === 'Angpao' || form.jenis === 'Keduanya') && (
                                <div className="form-group animate-fade-in">
                                    <label className="form-label">Nominal Angpao (Rp)</label>
                                    <input type="number" className="form-input shadow-inner-white" placeholder="cth: 500000" value={form.nominal} onChange={e => setForm(p => ({ ...p, nominal: e.target.value }))} />
                                </div>
                            )}
                            {(form.jenis === 'Kado' || form.jenis === 'Keduanya') && (
                                <div className="form-group animate-fade-in">
                                    <label className="form-label">Deskripsi Kado Fisik</label>
                                    <input className="form-input shadow-inner-white" placeholder="cth: Set Blender, Logam Mulia 5gr, Voucher..." value={form.deskripsi_kado} onChange={e => setForm(p => ({ ...p, deskripsi_kado: e.target.value }))} />
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label">Diterima Saat Sesi</label>
                                    <select className="form-select shadow-inner-white" value={form.sesi} onChange={e => setForm(p => ({ ...p, sesi: e.target.value }))}>
                                        <option value="Akad">Akad Nikah</option>
                                        <option value="Resepsi">Resepsi Pernikahan</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Status Follow Up</label>
                                    <select className="form-select shadow-inner-white" value={form.sudah_ucapkan} onChange={e => setForm(p => ({ ...p, sudah_ucapkan: e.target.value === 'true' }))}>
                                        <option value="false">Belum Dikirim Ucapan</option>
                                        <option value="true">Sudah Dikirim Ucapan</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Catatan Tambahan (Internal)</label>
                                <textarea className="form-textarea min-h-[80px] shadow-inner-white" rows={2} placeholder="Keterangan opsional seperti alamat kiriman kado, dll..." value={form.catatan || ''} onChange={e => setForm(p => ({ ...p, catatan: e.target.value }))} />
                            </div>
                        </div>

                        <div className="flex gap-4 justify-end mt-10 pt-8 border-t border-border">
                            <button className="btn-outline px-8 py-3 text-xs font-bold uppercase tracking-widest" onClick={() => setModal(false)}>Batal</button>
                            <button className="btn-rose px-10 py-3 text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-gold/20" onClick={handleSave} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan Catatan'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}