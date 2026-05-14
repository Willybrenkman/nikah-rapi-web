// src/pages/PrivacyPolicy.jsx
import { useNavigate } from 'react-router-dom'

const s = {
  page: { minHeight: '100vh', background: '#FDFAF6', fontFamily: "'DM Sans', sans-serif", padding: '40px 20px' },
  container: { maxWidth: 720, margin: '0 auto' },
  logo: { fontFamily: "'Playfair Display', serif", fontSize: 24, color: '#C9956C', letterSpacing: 2, marginBottom: 8, cursor: 'pointer' },
  lastUpdate: { fontSize: 12, color: '#9B8070', marginBottom: 40 },
  h1: { fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#2C1810', marginBottom: 8, marginTop: 0 },
  h2: { fontFamily: "'Playfair Display', serif", fontSize: 18, color: '#2C1810', marginTop: 36, marginBottom: 10 },
  p: { fontSize: 14, color: '#5C3D2E', lineHeight: 1.8, marginBottom: 12 },
  ul: { fontSize: 14, color: '#5C3D2E', lineHeight: 1.8, paddingLeft: 20, marginBottom: 12 },
  divider: { height: 1, background: '#F0E6DF', margin: '32px 0' },
  back: { background: 'none', border: '1.5px solid #C9956C', color: '#C9956C', padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, marginBottom: 40 },
}

export default function PrivacyPolicy() {
  const navigate = useNavigate()
  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.logo} onClick={() => navigate('/')}>NIKAH RAPI ✦</div>
        <p style={s.lastUpdate}>Terakhir diperbarui: Mei 2025</p>

        <button style={s.back} onClick={() => navigate(-1)}>← Kembali</button>

        <h1 style={s.h1}>Kebijakan Privasi</h1>
        <p style={s.p}>
          Nikah Rapi ("kami", "layanan") berkomitmen untuk melindungi privasi pengguna sesuai dengan
          Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP) Republik Indonesia.
          Dokumen ini menjelaskan data apa yang kami kumpulkan, bagaimana kami menggunakannya, dan hak-hak Anda.
        </p>

        <div style={s.divider} />

        <h2 style={s.h2}>1. Data yang Kami Kumpulkan</h2>
        <p style={s.p}><strong>Data Pengguna (Owner Akun):</strong></p>
        <ul style={s.ul}>
          <li>Alamat email (digunakan untuk autentikasi)</li>
          <li>Nama pasangan pengantin, tanggal dan lokasi pernikahan</li>
          <li>Data anggaran, vendor, checklist, dan catatan yang Anda masukkan sendiri</li>
        </ul>
        <p style={s.p}><strong>Data Tamu (Data Pihak Ketiga):</strong></p>
        <ul style={s.ul}>
          <li>Nama tamu, nomor telepon, asal kota, dan status RSVP</li>
          <li>Data ini dimasukkan oleh pemilik akun dan menjadi tanggung jawab pemilik akun</li>
        </ul>
        <p style={s.p}><strong>Data Teknis:</strong></p>
        <ul style={s.ul}>
          <li>Log aktivitas dalam aplikasi untuk keperluan audit keamanan</li>
          <li>Data tidak dikaitkan dengan identitas pribadi di luar aplikasi</li>
        </ul>

        <div style={s.divider} />

        <h2 style={s.h2}>2. Cara Kami Menggunakan Data</h2>
        <ul style={s.ul}>
          <li>Menyediakan dan menjalankan layanan Nikah Rapi</li>
          <li>Mengirimkan email transaksional (reset password, notifikasi akun)</li>
          <li>Meningkatkan kualitas layanan berdasarkan pola penggunaan agregat (tanpa identitas)</li>
          <li>Mematuhi kewajiban hukum yang berlaku</li>
        </ul>
        <p style={s.p}>
          Kami <strong>tidak menjual</strong> data pribadi Anda kepada pihak ketiga manapun.
        </p>

        <div style={s.divider} />

        <h2 style={s.h2}>3. Penyimpanan Data</h2>
        <p style={s.p}>
          Data disimpan di infrastruktur Supabase (server berlokasi di Asia/Singapore).
          Supabase mematuhi standar keamanan SOC 2 Type II. Data dienkripsi saat transit (TLS)
          dan saat disimpan (AES-256).
        </p>
        <p style={s.p}>
          Data akun akan disimpan selama masa aktif layanan Anda. Setelah masa aktif berakhir,
          data akan dihapus dalam 90 hari kecuali ada permintaan perpanjangan.
        </p>

        <div style={s.divider} />

        <h2 style={s.h2}>4. Hak Anda sebagai Subjek Data</h2>
        <p style={s.p}>Sesuai UU PDP, Anda berhak untuk:</p>
        <ul style={s.ul}>
          <li><strong>Mengakses</strong> data pribadi yang kami simpan tentang Anda</li>
          <li><strong>Memperbarui</strong> data yang tidak akurat melalui halaman Pengaturan</li>
          <li><strong>Menghapus</strong> akun dan seluruh data Anda dengan menghubungi kami</li>
          <li><strong>Mengunduh</strong> data Anda dalam format Excel melalui fitur Export</li>
          <li><strong>Membatasi</strong> pemrosesan data dalam situasi tertentu</li>
        </ul>

        <div style={s.divider} />

        <h2 style={s.h2}>5. Data Tamu & Persetujuan</h2>
        <p style={s.p}>
          Sebagai pemilik akun, Anda bertanggung jawab untuk memastikan tamu yang datanya
          Anda masukkan telah memberikan persetujuan. Kami menyarankan untuk mencantumkan
          informasi singkat di halaman undangan bahwa data RSVP akan disimpan oleh penyelenggara.
        </p>

        <div style={s.divider} />

        <h2 style={s.h2}>6. Cookie & Penyimpanan Lokal</h2>
        <p style={s.p}>
          Aplikasi menggunakan <code>localStorage</code> untuk menyimpan sesi login dan
          cache data pernikahan secara lokal di perangkat Anda. Data ini tidak dikirim
          ke pihak ketiga. Membersihkan data browser akan menghapus cache ini.
        </p>

        <div style={s.divider} />

        <h2 style={s.h2}>7. Perubahan Kebijakan</h2>
        <p style={s.p}>
          Kami dapat memperbarui kebijakan ini sewaktu-waktu. Perubahan signifikan akan
          diinformasikan melalui email atau notifikasi dalam aplikasi minimal 7 hari sebelum berlaku.
        </p>

        <div style={s.divider} />

        <h2 style={s.h2}>8. Hubungi Kami</h2>
        <p style={s.p}>
          Pertanyaan terkait privasi data dapat dikirimkan ke:
          <br />
          <strong>Email:</strong> support@nikahrapi.online
          <br />
          <strong>WhatsApp:</strong> Tersedia melalui tombol WhatsApp di halaman utama
        </p>

        <div style={{ ...s.divider, marginTop: 48 }} />
        <p style={{ ...s.p, fontSize: 12, color: '#9B8070', textAlign: 'center' }}>
          © 2025 Nikah Rapi. Hak cipta dilindungi undang-undang.
          <br />
          <span style={{ cursor: 'pointer', color: '#C9956C' }} onClick={() => navigate('/')}>Kembali ke Beranda</span>
        </p>
      </div>
    </div>
  )
}
