// src/pages/Katering.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useWedding } from '../hooks/useWedding'
import { confirmDelete } from '../lib/swal'
import toast from 'react-hot-toast'
import { syncService } from '../lib/syncService'

const rp = (n = 0) => 'Rp ' + Number(n).toLocaleString('id-ID')
const EMPTY_VENDOR = { nama_vendor: '', pic_nama: '', pic_hp: '', total_kontrak: '', dp_dibayar: '', deadline_pelunasan: '', estimasi_porsi: '', harga_per_pax: '' }
const EMPTY_MENU = { nama_menu: '', jenis: 'Makanan', sistem: 'Prasmanan', ada: true }

export default function Katering() {
    const { wedding } = useWedding()
    const [vendor, setVendor] = useState(null)
    const [menus, setMenus] = useState([])
    const [catatan, setCatatan] = useState('')
    const [loading, setLoading] = useState(true)
    const [modalV, setModalV] = useState(false)
    const [modalM, setModalM] = useState(false)
    const [formV, setFormV] = useState(EMPTY_VENDOR)
    const [formM, setFormM] = useState(EMPTY_MENU)
    const [editMId, setEditMId] = useState(null)
    const [saving, setSaving] = useState(false)

    useEffect(() => { if (wedding) fetchData() }, [wedding])

    const fetchData = async () => {
        setLoading(true)
        if (wedding.id === 'dummy-wedding-id') {
            setVendor({
                id: 1,
                nama_vendor: 'Catering Berkah Barokah',
                pic_nama: 'Ibu Ani',
                pic_hp: '0856789012',
                total_kontrak: 45000000,
                dp_dibayar: 20000000,
                estimasi_porsi: 500,
                harga_per_pax: 85000,
                deadline_pelunasan: '2026-07-15',
                catatan_khusus: 'Tamu VIP 50 porsi, 10 porsi vegetarian, tanpa MSG.'
            })
            setFormV({
                nama_vendor: 'Catering Berkah Barokah',
                pic_nama: 'Ibu Ani',
                pic_hp: '0856789012',
                total_kontrak: 45000000,
                dp_dibayar: 20000000,
                estimasi_porsi: 500,
                harga_per_pax: 85000,
                deadline_pelunasan: '2026-07-15'
            })
            setCatatan('Tamu VIP 50 porsi, 10 porsi vegetarian, tanpa MSG.')
            setMenus([
                { id: 1, nama_menu: 'Nasi Kebuli Spesial', jenis: 'Makanan', sistem: 'Prasmanan', ada: true },
                { id: 2, nama_menu: 'Ayam Bakar Taliwang', jenis: 'Makanan', sistem: 'Prasmanan', ada: true },
                { id: 3, nama_menu: 'Sate Padang Authentic', jenis: 'Makanan', sistem: 'Gubukan', ada: true },
                { id: 4, nama_menu: 'Es Teller Sultan', jenis: 'Minuman', sistem: 'Gubukan', ada: true },
                { id: 5, nama_menu: 'Pudding Mozaik', jenis: 'Dessert', sistem: 'Display', ada: true },
            ])
            setLoading(false)
            return
        }
        const [vRes, mRes] = await Promise.all([
            supabase.from('katering_vendor').select('*').eq('wedding_id', wedding.id).single(),
            supabase.from('katering_menu').select('*').eq('wedding_id', wedding.id).order('created_at'),
        ])
        if (vRes.data) { setVendor(vRes.data); setFormV(vRes.data); setCatatan(vRes.data.catatan_khusus || '') }
        setMenus(mRes.data || [])
        setLoading(false)
    }

    const saveVendor = async () => {
        setSaving(true)
        const payload = { ...formV, total_kontrak: Number(formV.total_kontrak) || 0, dp_dibayar: Number(formV.dp_dibayar) || 0, estimasi_porsi: Number(formV.estimasi_porsi) || 0, harga_per_pax: Number(formV.harga_per_pax) || 0, catatan_khusus: catatan, wedding_id: wedding.id }
        
        try {
            if (vendor) { 
                await supabase.from('katering_vendor').update(payload).eq('id', vendor.id) 
            } else { 
                await supabase.from('katering_vendor').insert(payload) 
            }

            // --- INVERSE SYNC TO BUDGET ---
            await syncService.syncToBudget(
                wedding.id, 
                'katering', 
                formV.nama_vendor || 'Katering', 
                payload.total_kontrak, 
                payload.dp_dibayar
            )

            toast.success('Data katering & budget disinkronkan! ✨')
            setModalV(false)
            fetchData()
        } catch (error) {
            console.error(error)
            toast.error('Gagal sinkronisasi ke budget')
        } finally {
            setSaving(false)
        }
    }

    const openAddMenu = () => { setFormM(EMPTY_MENU); setEditMId(null); setModalM(true) }
    const openEditMenu = (m) => { setFormM({ nama_menu: m.nama_menu, jenis: m.jenis, sistem: m.sistem, ada: m.ada }); setEditMId(m.id); setModalM(true) }

    const saveMenu = async () => {
        if (!formM.nama_menu) { toast.error('Nama menu wajib!'); return }
        setSaving(true)
        const payload = { ...formM, wedding_id: wedding.id }
        if (editMId) { await supabase.from('katering_menu').update(payload).eq('id', editMId); toast.success('Menu diperbarui!') }
        else { await supabase.from('katering_menu').insert(payload); toast.success('Menu ditambahkan!') }
        setModalM(false); fetchData(); setSaving(false)
    }

    const deleteMenu = async (id) => {
        const result = await confirmDelete('Hapus menu ini?', 'Menu ini akan dihapus dari daftar hidangan.')
        if (!result.isConfirmed) return

        await supabase.from('katering_menu').delete().eq('id', id)
        toast.success('Dihapus!')
        fetchData()
    }

    const deleteVendor = async () => {
        if (!vendor) return
        const result = await confirmDelete('Hapus vendor katering?', 'Semua rincian kontrak dan pembayaran katering akan dihapus permanen.')
        if (!result.isConfirmed) return
        
        await supabase.from('katering_vendor').delete().eq('id', vendor.id)
        toast.success('Vendor Katering dihapus!')
        setVendor(null)
        setFormV(EMPTY_VENDOR)
        fetchData()
    }

    const totalKatering = (vendor?.estimasi_porsi || 0) * (vendor?.harga_per_pax || 0)
    const sisa = (vendor?.total_kontrak || 0) - (vendor?.dp_dibayar || 0)

    if (loading) return <div className="text-center py-20 text-brown-muted font-playfair italic">Menyusun daftar hidangan katering...</div>

    return (
        <div className="animate-fade-in pb-12">
            <div className="section-header">
                <div>
                    <h1 className="section-title">Katering & Menu 🍽️</h1>
                    <p className="section-subtitle">Manajemen vendor katering dan rincian menu hidangan</p>
                </div>
                <div className="flex gap-2">
                    {vendor && (
                        <button className="btn-outline px-4 text-danger border-danger hover:bg-danger hover:text-white" onClick={deleteVendor}>
                            🗑️ Hapus Vendor
                        </button>
                    )}
                    <button className="btn-rose px-6 shadow-lg shadow-rose-gold/20" onClick={() => setModalV(true)}>
                        ⚙️ {vendor ? 'Edit' : 'Atur'} Vendor
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="stat-card">
                    <div className="w-12 h-12 rounded-2xl bg-rose-gold/10 flex items-center justify-center text-xl mb-4">👥</div>
                    <div className="font-playfair text-2xl font-bold text-brown leading-tight">{vendor?.estimasi_porsi || 0}</div>
                    <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Estimasi Porsi</div>
                </div>
                <div className="stat-card border-sage/20">
                    <div className="w-12 h-12 rounded-2xl bg-sage/10 flex items-center justify-center text-xl mb-4">💰</div>
                    <div className="font-playfair text-2xl font-bold text-brown leading-tight">{rp(vendor?.harga_per_pax || 0)}</div>
                    <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Harga per Pax</div>
                </div>
                <div className="stat-card border-rose-gold/20">
                    <div className="w-12 h-12 rounded-2xl bg-rose-gold/5 flex items-center justify-center text-xl mb-4">🍽️</div>
                    <div className="font-playfair text-2xl font-bold text-brown leading-tight">{rp(totalKatering)}</div>
                    <div className="text-xs font-bold text-brown-muted mt-2 uppercase tracking-wider">Total Katering</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
                {/* Vendor info */}
                <div className="card lg:col-span-2">
                    <div className="p-6 border-b border-border bg-ivory/10 flex items-center gap-3">
                        <span className="text-xl">🏪</span>
                        <h2 className="font-playfair text-lg font-bold text-brown">Vendor Katering</h2>
                    </div>
                    <div className="p-2 space-y-1">
                        {vendor ? (
                            <div className="space-y-1">
                                <div className="summary-row px-5 py-4 hover:bg-ivory/30 rounded-xl transition-colors">
                                    <span className="text-sm font-medium text-brown-muted">Nama Vendor</span>
                                    <span className="font-bold text-brown">{vendor.nama_vendor || '—'}</span>
                                </div>
                                <div className="summary-row px-5 py-4 hover:bg-ivory/30 rounded-xl transition-colors">
                                    <span className="text-sm font-medium text-brown-muted">Kontak (PIC)</span>
                                    <span className="font-bold text-brown text-right text-xs">{vendor.pic_nama ? `${vendor.pic_nama} (${vendor.pic_hp || ''})` : '—'}</span>
                                </div>
                                <div className="summary-row px-5 py-4 hover:bg-ivory/30 rounded-xl transition-colors">
                                    <span className="text-sm font-medium text-brown-muted">Total Kontrak</span>
                                    <span className="font-bold text-brown">{rp(vendor.total_kontrak)}</span>
                                </div>
                                <div className="summary-row px-5 py-4 hover:bg-ivory/30 rounded-xl transition-colors">
                                    <span className="text-sm font-medium text-brown-muted">DP / Terbayar</span>
                                    <span className="font-bold text-sage bg-sage/10 px-3 py-1 rounded-full text-xs">{rp(vendor.dp_dibayar)} ✓</span>
                                </div>
                                <div className="summary-row px-5 py-4 hover:bg-ivory/30 rounded-xl transition-colors border-t border-border mt-2">
                                    <span className="text-sm font-bold text-brown">Sisa Pelunasan</span>
                                    <span className="font-black text-danger">{rp(sisa)}</span>
                                </div>
                                <div className="summary-row px-5 py-4 bg-rose-gold/5 rounded-xl border border-rose-gold/10 mt-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs">📅</span>
                                        <span className="text-xs font-bold text-brown uppercase tracking-tighter">Deadline Pelunasan</span>
                                    </div>
                                    <span className="font-bold text-brown text-xs">
                                        {vendor.deadline_pelunasan ? new Date(vendor.deadline_pelunasan).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-20 px-6">
                                <div className="w-16 h-16 bg-ivory rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-sm">🍽️</div>
                                <p className="text-brown-muted text-sm font-medium italic mb-8">Data katering belum diatur. Masukkan detail vendor untuk melacak anggaran dan menu.</p>
                                <button className="btn-rose px-10 shadow-lg shadow-rose-gold/20" onClick={() => setModalV(true)}>+ Atur Vendor Sekarang</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Menu table */}
                <div className="card lg:col-span-3 p-0 overflow-hidden flex flex-col group/table">
                    <div className="p-6 border-b border-border flex items-center justify-between bg-ivory/5">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">📜</span>
                            <h2 className="font-playfair text-lg font-bold text-brown">Daftar Menu Utama</h2>
                        </div>
                        <button className="btn-rose py-1.5 px-4 text-xs font-bold shadow-sm" onClick={openAddMenu}>+ Tambah Menu</button>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table>
                            <thead>
                                <tr>
                                    <th className="th">Menu</th>
                                    <th className="th">Kategori</th>
                                    <th className="th">Sistem Penyajian</th>
                                    <th className="th">Status</th>
                                    <th className="th text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {menus.length === 0 ? (
                                    <tr><td colSpan={5} className="td text-center py-24 text-brown-muted italic">Belum ada menu yang didaftarkan.</td></tr>
                                ) : menus.map(m => (
                                    <tr key={m.id} className="tr group">
                                        <td className="td">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{m.jenis === 'Makanan' ? '🍲' : m.jenis === 'Minuman' ? '🍹' : m.jenis === 'Dessert' ? '🍰' : '🍿'}</span>
                                                <span className="font-bold text-brown group-hover:text-rose-gold transition-colors">{m.nama_menu}</span>
                                            </div>
                                        </td>
                                        <td className="td">
                                            <span className="badge-rose text-[9px] px-2.5 py-1 uppercase font-bold tracking-tighter opacity-80">{m.jenis}</span>
                                        </td>
                                        <td className="td text-[10px] font-medium text-brown-muted italic">{m.sistem}</td>
                                        <td className="td">
                                            <span className={`badge ${m.ada ? 'badge-green' : 'badge-grey'} text-[9px]`}>
                                                {m.ada ? '✓ Tersedia' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="td text-right">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="btn-sm-edit" onClick={() => openEditMenu(m)}>Edit</button>
                                                <button className="btn-sm-danger p-1" onClick={() => deleteMenu(m.id)}>✕</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Catatan khusus */}
            <div className="card group">
                <div className="p-6 border-b border-border bg-ivory/5 flex items-center gap-3">
                    <span className="text-xl">⚠️</span>
                    <h2 className="font-playfair text-lg font-bold text-brown">Catatan Khusus & Permintaan Diet</h2>
                </div>
                <div className="p-8">
                    <textarea
                        className="form-textarea min-h-[140px] shadow-inner-white border-rose-gold/10"
                        placeholder="Tamu vegetarian, alergi kacang, permintaan khusus meja VIP, atau detail teknis penyajian lainnya..."
                        value={catatan} onChange={e => setCatatan(e.target.value)}
                        onBlur={async () => { if (vendor) { await supabase.from('katering_vendor').update({ catatan_khusus: catatan }).eq('id', vendor.id) } }}
                    />
                    <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-brown-muted uppercase tracking-widest bg-ivory/30 px-4 py-2 rounded-lg w-fit">
                        <span className="w-1.5 h-1.5 bg-sage rounded-full animate-pulse"></span>
                        Tersimpan otomatis saat kursor meninggalkan area teks
                    </div>
                </div>
            </div>

            {/* Modal Vendor */}
            {modalV && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModalV(false)}>
                    <div className="modal-box max-w-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-playfair text-xl font-bold text-brown">Data Vendor Katering</h2>
                            <button onClick={() => setModalV(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-ivory text-brown-muted transition-colors">✕</button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="form-group">
                                <label className="form-label">Nama Vendor / Catering</label>
                                <input className="form-input" placeholder="Masukkan nama vendor..." value={formV.nama_vendor || ''} onChange={e => setFormV(p => ({ ...p, nama_vendor: e.target.value }))} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label">Nama PIC</label>
                                    <input className="form-input" placeholder="Nama kontak..." value={formV.pic_nama || ''} onChange={e => setFormV(p => ({ ...p, pic_nama: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">WhatsApp PIC</label>
                                    <input className="form-input" placeholder="08xx..." value={formV.pic_hp || ''} onChange={e => setFormV(p => ({ ...p, pic_hp: e.target.value }))} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label">Estimasi Porsi</label>
                                    <input type="number" className="form-input" placeholder="0" value={formV.estimasi_porsi || ''} onChange={e => setFormV(p => ({ ...p, estimasi_porsi: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Harga per Pax (Rp)</label>
                                    <input type="number" className="form-input" placeholder="0" value={formV.harga_per_pax || ''} onChange={e => setFormV(p => ({ ...p, harga_per_pax: e.target.value }))} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label">Total Kontrak (Rp)</label>
                                    <input type="number" className="form-input" placeholder="0" value={formV.total_kontrak || ''} onChange={e => setFormV(p => ({ ...p, total_kontrak: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">DP Dibayar (Rp)</label>
                                    <input type="number" className="form-input" placeholder="0" value={formV.dp_dibayar || ''} onChange={e => setFormV(p => ({ ...p, dp_dibayar: e.target.value }))} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Tenggat Pelunasan</label>
                                <input type="date" className="form-input" value={formV.deadline_pelunasan || ''} onChange={e => setFormV(p => ({ ...p, deadline_pelunasan: e.target.value }))} />
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-border">
                            <button className="btn-outline px-6" onClick={() => setModalV(false)}>Batal</button>
                            <button className="btn-rose px-8" onClick={saveVendor} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan Data Vendor'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Menu */}
            {modalM && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModalM(false)}>
                    <div className="modal-box max-w-md">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-playfair text-xl font-bold text-brown">{editMId ? 'Edit' : 'Tambah'} Menu Hidangan</h2>
                            <button onClick={() => setModalM(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-ivory text-brown-muted transition-colors">✕</button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="form-group">
                                <label className="form-label">Nama Hidangan / Menu</label>
                                <input className="form-input" placeholder="cth: Nasi Putih, Ayam Bakar Taliwang..." value={formM.nama_menu} onChange={e => setFormM(p => ({ ...p, nama_menu: e.target.value }))} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label">Kategori</label>
                                    <select className="form-select" value={formM.jenis} onChange={e => setFormM(p => ({ ...p, jenis: e.target.value }))}>
                                        {['Makanan', 'Minuman', 'Dessert', 'Snack'].map(v => <option key={v}>{v}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Sistem Penyajian</label>
                                    <select className="form-select" value={formM.sistem} onChange={e => setFormM(p => ({ ...p, sistem: e.target.value }))}>
                                        {['Prasmanan', 'Gubukan', 'Display', 'Set Menu'].map(v => <option key={v}>{v}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Status Ketersediaan</label>
                                <select className="form-select" value={formM.ada ? 'Tersedia' : 'Belum Konfirmasi'} onChange={e => setFormM(p => ({ ...p, ada: e.target.value === 'Tersedia' }))}>
                                    {['Tersedia', 'Belum Konfirmasi'].map(v => <option key={v}>{v}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-border">
                            <button className="btn-outline px-6" onClick={() => setModalM(false)}>Batal</button>
                            <button className="btn-rose px-8" onClick={saveMenu} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan Menu'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}