import { useNavigate } from 'react-router-dom'

export default function Panduan() {
    const navigate = useNavigate()

    const guides = [
        {
            icon: '📊', title: '01. Dashboard Utama',
            content: 'Pusat pantauan. Ingat, Progress Persiapan di sini tidak dihitung otomatis dari detail vendor (Katering, MUA, dll), melainkan murni dari menu "Checklist Persiapan".'
        },
        {
            icon: '💰', title: '02. Budget Planner',
            content: 'Pusat pencatatan keuangan! Angka "Estimasi" otomatis terisi dari menu lain (Dekorasi, Undangan, dll). Namun untuk mengisi uang yang kamu keluarkan (Realisasi Aktual), kamu cukup mencatatnya langsung di tabel Rincian Pengeluaran pada halaman ini.'
        },
        {
            icon: '📦', title: '03. Seserahan Tracker',
            content: 'Gunakan ini untuk memastikan barang bawaan (sangjit/hantaran) tidak ada yang tertinggal. Tandai status: Perlu Dibeli, Telah Dibeli, hingga Siap Hantar.'
        },
        {
            icon: '🎁', title: '04. Kado & Angpao',
            content: 'Gunakan setelah acara selesai. Masukkan semua amplop dan kado fisik. Sistem akan memisahkan uang tunai dan barang, lengkap dengan grafik pemasukan.'
        },
        {
            icon: '👥', title: '05. Guest List (Daftar Tamu)',
            content: 'Catat semua nama tamu, asal kota, dan pihak yang mengundang. Data dari sini sangat penting untuk mengestimasi jumlah porsi makanan.'
        },
        {
            icon: '✉️', title: '06. RSVP Tracker',
            content: 'Buku tamu digital hari-H. Klik tombol "Belum" pada kolom Kupon Makan agar berubah menjadi "✓ Sudah" untuk menandai bahwa tamu telah menerima kupon fisiknya.'
        },
        {
            icon: '🤝', title: '07. Vendor Manager',
            content: 'Pusat manajemen kontrak. Masukkan kontak PIC dan link Google Drive untuk menyimpan file invoice. Jatuh tempo pelunasan terdekat akan muncul di Dashboard.'
        },
        {
            icon: '📅', title: '08. Timeline Acara',
            content: 'Buat susunan acara (rundown) hari-H dengan sangat detail dari jam ke jam, mulai dari persiapan makeup pagi hingga acara penutupan.'
        },
        {
            icon: '✅', title: '09. Checklist Persiapan',
            content: 'To-Do List utama. Tambahkan tugas seperti "Meeting WO", "Test Food", atau "Ambil Baju". Mencentang tugas di sini akan memajukan Bar Progress di Dashboard.'
        },
        {
            icon: '🎨', title: '10. Dekorasi & Tema',
            content: 'Fokus pada konsep visual. Catat palet warna pelaminan, jenis bunga, dan referensi desain agar tidak ada yang terlewat saat *technical meeting*.'
        },
        {
            icon: '🍽️', title: '11. Katering & Menu',
            content: 'Bagi makananmu menjadi Buffet (Prasmanan) dan Food Stall (Gubukan). Pastikan total porsi cukup untuk jumlah tamu yang terdaftar di Guest List.'
        },
        {
            icon: '💌', title: '12. Undangan & Desain',
            content: 'Kelola informasi vendor percetakan undangan fisik maupun pembuat undangan website digital. Simpan link website undanganmu di sini.'
        },
        {
            icon: '💄', title: '13. MUA & Busana',
            content: 'Catat detail jumlah baju yang disewa/dibuat untuk pengantin, orang tua, dan pagar ayu/bagus, lengkap beserta ukuran dan jadwal *fitting*-nya.'
        },
        {
            icon: '📷', title: '14. Foto & Video',
            content: 'Catat kesepakatan jumlah kru fotografer, durasi video cinematic, dan tenggat waktu (deadline) kapan album cetak dijanjikan selesai.'
        },
        {
            icon: '💍', title: '15. Cincin & Mahar',
            content: 'Selain spesifikasi cincin, terdapat juga "Checklist Prosesi Sakral" yang universal (Alat ibadah, dokumen KUA/Catatan Sipil, tanda kasih) agar tidak tertinggal di hari H.'
        },
        {
            icon: '🌙', title: '16. Honeymoon Planner',
            content: 'Jika tujuannya banyak (Bali - Lombok), ketik semuanya di kotak Destinasi. Lalu pecah jadwalnya per-hari (Hari 1 di Bali, Hari 4 nyeberang) di tabel Itinerary.'
        },
        {
            icon: '🎀', title: '17. Souvenir & Hampers',
            content: 'Catat jenis souvenir untuk tamu reguler dan tamu VIP. Pastikan jumlah pesanan minimal sama dengan jumlah undangan yang disebar.'
        },
        {
            icon: '📝', title: '18. Catatan Penting',
            content: 'Buku catatan bebas. Gunakan untuk menaruh ide mendadak, pesan dari orang tua, atau pengingat hal-hal kecil yang belum masuk kategori manapun.'
        },
        {
            icon: '📋', title: '19. Rekap Akhir',
            content: 'Langkah terakhir! Klik tombol "Download Rekap Excel" untuk menghasilkan file Master berisi semua tabel di atas. Siap di-print untuk dibagikan ke panitia keluarga.'
        },
        {
            icon: '🔒', title: '20. Keamanan Akun',
            content: 'Untuk menjaga kerahasiaan data keuanganmu, sistem akan otomatis melakukan "Logout" jika tidak ada aktivitas (klik/scroll) selama 30 menit. Pastikan kamu selalu menyimpan perubahan sebelum meninggalkan layar.'
        }
    ]

    return (
        <div className="animate-fade-in pb-12">
            <div className="section-header">
                <div>
                    <h1 className="section-title">Pusat Panduan 📖</h1>
                    <p className="section-subtitle">Pelajari cara memaksimalkan semua fitur Nikah Rapi untuk persiapan pernikahanmu</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guides.map((guide, i) => (
                    <div key={i} className="card p-8 border-sage/10 hover:shadow-lg transition-all group bg-gradient-to-br from-white to-ivory/30">
                        <div className="w-14 h-14 rounded-2xl bg-sage/10 flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:scale-110 transition-transform">
                            {guide.icon}
                        </div>
                        <h2 className="font-playfair text-xl font-bold text-brown mb-3">{guide.title}</h2>
                        <p className="text-sm text-brown-muted/80 leading-relaxed font-medium">
                            {guide.content}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-10 card p-8 border-rose-gold/20 bg-rose-gold/5 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="font-playfair text-lg font-bold text-brown mb-2">Sudah Siap Memulai?</h3>
                    <p className="text-sm text-brown-muted">Kembali ke Dashboard untuk melanjutkan perencanaan pernikahan impianmu.</p>
                </div>
                <button onClick={() => navigate('/')} className="btn-rose px-8 py-3 whitespace-nowrap shadow-lg shadow-rose-gold/20">
                    Ke Dashboard 🚀
                </button>
            </div>
        </div>
    )
}
