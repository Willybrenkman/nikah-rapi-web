import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingNav from '../../components/landing/LandingNav';
import LandingDemoPreview from '../../components/landing/LandingDemoPreview';
import SEO from '../../components/SEO';
import './LandingMain.css';

const LandingMain = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const videoRef = useRef(null);

  const checkoutUrl = "https://checkout.nikahrapi.online/";

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));
    return () => revealElements.forEach(el => observer.unobserve(el));
  }, []);

  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);

  const loadVideo = () => {
    if (!videoRef.current) return;
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube.com/embed/YPl7CuUqbUs?autoplay=1&mute=1&rel=0&modestbranding=1';
    iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;border-radius:16px;';
    iframe.allow = 'autoplay; encrypted-media; fullscreen';
    iframe.allowFullscreen = true;
    videoRef.current.innerHTML = '';
    videoRef.current.appendChild(iframe);
    videoRef.current.style.cursor = 'default';
  };

  return (
    <div className="landing-container" style={{ paddingTop: '70px' }}>
      <SEO
        title="NIKAH RAPI — Wedding Planner Digital #1 Indonesia | Budget, Vendor, Seserahan"
        description="Atur semua persiapan pernikahan di 1 Web App. Budget planner otomatis, seserahan tracker, vendor manager, kado & angpao tracker. 22+ modul terintegrasi. Rp 129.000 akses seumur hidup."
        path="/"
        keywords="wedding planner indonesia, persiapan nikah, budget pernikahan, seserahan tracker, vendor pernikahan, aplikasi nikah, wedding organizer digital"
      />
      <LandingNav />
      <main className="landing-page">

      {/* ══ HERO ══ */}
      <section className="hero">
        <div className="badge">✦ Satu-satunya Wedding Planner dengan Seserahan & Angpao Tracker</div>
        <p className="hero-eyebrow">Mau nikah tapi pusing urus ratusan hal sekaligus?</p>
        <h1 className="hero-title">
          Pernikahanmu Terlalu Penting<br />
          untuk Dikelola dari <em>Grup WA & Spreadsheet</em>
        </h1>
        <p className="hero-hook">
          "Budget bocor tanpa sadar. Seserahan ada yang ketinggalan. Vendor susah dihubungi.<br />
          NIKAH RAPI hadir supaya hari terbaikmu benar-benar terasa seperti hari terbaik — bukan hari paling chaos."
        </p>
        <p className="hero-title-sub">
          22 modul terintegrasi · Kalkulasi otomatis · Akses berdua dari mana saja
        </p>
        <div className="drama-tags">
          <span className="drama-tag">😰 Budget Bocor Tanpa Sadar</span>
          <span className="drama-tag">📋 Seserahan Ketinggalan</span>
          <span className="drama-tag">🏢 Vendor Tiba-tiba Ghosting</span>
          <span className="drama-tag">🎁 Data Angpao Hilang</span>
        </div>

        <div className="product-showcase">
          <div className="showcase-glow"></div>
          <div className="float-badge float-badge-top">
            <div className="fb-icon" style={{ background: '#FFF0EC' }}>🎁</div>
            <div>
              <div className="fb-label">Kado & Angpao Tracker</div>
              <div className="fb-val">Rp 48.500.000 tercatat ✓</div>
            </div>
          </div>
          <div className="float-badge float-badge-bot">
            <div className="fb-icon" style={{ background: '#F0F4F0' }}>💍</div>
            <div>
              <div className="fb-label">Seserahan Tracker</div>
              <div className="fb-val">12/15 item siap ✓</div>
            </div>
          </div>
          <div className="browser-frame">
            <div className="browser-bar">
              <div className="browser-dots">
                <div className="browser-dot" style={{ background: '#ff5f57' }}></div>
                <div className="browser-dot" style={{ background: '#febc2e' }}></div>
                <div className="browser-dot" style={{ background: '#28c840' }}></div>
              </div>
              <div className="browser-url">app.nikahrapi.online ✦</div>
            </div>
            <div className="preview-stage on">
              <picture>
                <source srcSet="/landing-assets/dashboard.webp" type="image/webp" />
                <img src="/landing-assets/dashboard-opt.png" alt="Dashboard NIKAH RAPI" width="665" height="346" fetchPriority="high" loading="eager" decoding="sync" style={{ width: '100%', height: 'auto' }} />
              </picture>
            </div>
          </div>
        </div>

        <div className="hero-cta-block">
          <div className="price-display">
            <div className="price-new"><sup style={{ fontSize: '22px' }}>Rp</sup>129.000</div>
            <div className="price-old"><s>Rp 299.000</s></div>
            <div className="price-save">HEMAT 57%</div>
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px' }}>
            <a
              href={checkoutUrl}
              className="btn-primary"
            >
              💍 Rapikan Pernikahanku Sekarang →
            </a>
            <button onClick={() => navigate('/demo')} className="btn-secondary">
              👁️ Lihat Demo Dulu (Gratis)
            </button>
          </div>
          <div className="cta-notes">
            <div className="cta-note-item">✓ Garansi 7 hari</div>
            <div className="cta-note-item">✓ Akses instan via WA</div>
            <div className="cta-note-item">✓ Tersimpan aman di Cloud</div>
          </div>
        </div>

        <div className="social-proof-bar">
          <div className="sp-avatars">
            <div className="sp-avatar" style={{ background: 'linear-gradient(135deg,#E8C4B8,#D4A090)' }}>🌸</div>
            <div className="sp-avatar" style={{ background: 'linear-gradient(135deg,#C4857A,#8B5E6A)' }}>💐</div>
            <div className="sp-avatar" style={{ background: 'linear-gradient(135deg,#C9A96E,#E8D5B0)' }}>👑</div>
            <div className="sp-avatar" style={{ background: 'linear-gradient(135deg,#A8B8AC,#7A8C7E)' }}>🍃</div>
          </div>
          <div className="stars">★★★★★</div>
          <span>Dipercaya pasangan yang mau nikah tenang, bukan panik</span>
        </div>
      </section>

      {/* ══ VIDEO SECTION ══ */}
      <section className="video-section" id="cara-kerja">
        <p className="section-eyebrow reveal">✨ Sebelum Kamu Beli, Lihat Dulu</p>
        <h2 className="section-title reveal">Semua Fitur dalam <em>Satu Dashboard</em></h2>
        <p className="video-sub reveal">
          Tidak perlu install apapun. Buka browser, login, langsung bisa. Data tersinkronisasi real-time — kamu isi di HP, pasanganmu lihat di laptop.
        </p>
        <div className="video-wrapper reveal">
          <div className="video-placeholder" ref={videoRef} onClick={loadVideo}>
            <div className="video-play-btn">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
            <div className="video-overlay-text">
              <span className="video-badge-tag">▶ Preview Demo</span>
            </div>
          </div>
        </div>
        <div className="video-features reveal">
          <div className="vf-card">
            <div className="vf-icon">💍</div>
            <div className="vf-text">
              <h3>Seserahan Tracker <span className="usp-tag">Eksklusif</span></h3>
              <p>Satu-satunya di Indonesia. Catat barang hantaran, harga, dan progress belanjanya.</p>
            </div>
          </div>
          <div className="vf-card">
            <div className="vf-icon">🎁</div>
            <div className="vf-text">
              <h3>Kado & Angpao Tracker <span className="usp-tag">Eksklusif</span></h3>
              <p>Data angpao masuk tercatat rapi, siap di-export jadi PDF untuk laporan ke orang tua.</p>
            </div>
          </div>
          <div className="vf-card">
            <div className="vf-icon">💰</div>
            <div className="vf-text">
              <h3>Budget Planner</h3>
              <p>Pantau budget estimasi vs realisasi secara real-time. Anti boncos, anti drama.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ DRAMA ══ */}
      <section className="drama-section">
        <p className="section-eyebrow reveal">Jujur... ini yang biasanya terjadi</p>
        <h2 className="section-title reveal">H-3 Bulan Menuju Nikah —<br /><em>Kok Malah Makin Panik?</em></h2>
        <div className="drama-grid">
          {[
            { icon: '💰', title: 'Budget Bocor Tanpa Sadar', desc: 'Estimasi Rp 80jt, realisasi Rp 120jt. Pengeluaran kecil-kecil tidak pernah dicatat — sampai akhirnya kehabisan di saat yang paling tidak tepat.', scenario: '"DP katering sudah dibayar tapi lupa dicatat. Sekarang gak tau sisa budget berapa. Stres."' },
            { icon: '💍', title: 'Seserahan Ada yang Ketinggalan', desc: 'Daftar di kertas. Beberapa di notes HP. Sebagian di chat WA. Sampai hari H baru sadar ada yang kurang.', scenario: '"Di lokasi baru sadar parfum seserahan ketinggalan di rumah. Semua orang udah tunggu."' },
            { icon: '🏢', title: 'Vendor Tiba-tiba Ghosting', desc: 'Nomor vendor susah dihubungi mendadak. Info kontrak entah di chat WA yang mana. Sudah bayar berapa pun lupa.', scenario: '"WO bilang ada double booking H-7. Kontraknya mana? Berapa yang sudah dibayar? Chaos."' },
            { icon: '💄', title: 'MUA Impian Double Booking', desc: 'Sudah fitting 3 kali, sudah cocok — tapi ternyata di-booking orang lain di tanggal yang sama. Ketahuan 2 minggu sebelum hari H.', scenario: '"Terpaksa cari MUA baru mendadak. Harganya 2x lipat karena mepet. Mau nangis."' },
            { icon: '🎁', title: 'Data Angpao Hilang Semua', desc: 'Amplop dikumpul tapi tidak dicatat siapa dari siapa. Mau kirim ucapan terima kasih tapi datanya tidak ada sama sekali.', scenario: '"Mau WA terima kasih tapi tidak tahu siapa kasih berapa. Akhirnya gak jadi. Awkward banget."' },
            { icon: '😫', title: 'Tamu Konfirmasi Overload', desc: 'Undangan 300 orang, kursi 250. RSVP tidak dikelola dengan baik — katering kurang, meja tidak cukup, tamu berdiri.', scenario: '"Tamu yang datang jauh lebih banyak dari yang konfirmasi. Makanan habis sebelum jam 2."' }
          ].map((item, i) => (
            <div key={i} className="drama-card reveal">
              <span className="drama-icon">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <div className="drama-scenario">{item.scenario}</div>
            </div>
          ))}
        </div>
        <p className="drama-closer reveal">"Semuanya nyata. Dan semuanya bisa dihindari — kalau ada satu tempat yang mencatat semuanya."</p>
      </section>

      {/* ══ SOLUTION ══ */}
      <section className="solution-section" id="fitur">
        <div className="solution-inner">
          <div className="solution-left">
            <p className="section-eyebrow reveal" style={{ color: 'var(--blush)' }}>Solusinya sederhana</p>
            <h2 className="section-title reveal">Satu tempat.<br />Semua tercatat.<br />Semua tenang.</h2>
            <p className="reveal">
              NIKAH RAPI dirancang khusus untuk pernikahan Indonesia — 22+ modul yang saling terhubung otomatis.
              Input sekali di mana saja, semua terupdate real-time. Kamu dan pasangan bisa akses bareng dari HP atau laptop, kapanpun.
            </p>
            <a href="#pricing" className="btn-secondary reveal" style={{ background: 'white', color: 'var(--mauve)', border: 'none' }}>Lihat Harga & Paket →</a>
          </div>
          <div className="feature-cards">
            {[
              { icon: '💍', title: 'Seserahan Tracker', tag: 'Eksklusif', desc: 'Catat semua item, harga, status beli. Auto-hitung total. Tidak ada di produk manapun di Indonesia.' },
              { icon: '🎁', title: 'Kado & Angpao Tracker', tag: 'Eksklusif', desc: 'Rekap siapa beri apa, nominal angpao, status ucapan terima kasih. Tidak ada yang terlewat.' },
              { icon: '💰', title: 'Budget Planner Otomatis', desc: 'Rencana vs realisasi terupdate real-time. Tahu persis kategori mana yang overbudget sebelum terlambat.' },
              { icon: '🏢', title: 'Vendor Manager Lengkap', desc: 'Kontak, kontrak, DP & pelunasan semua vendor. Tidak ada lagi vendor yang tiba-tiba "lupa" perjanjian.' }
            ].map((feat, i) => (
              <div key={i} className="feat-card reveal">
                <div className="feat-icon">{feat.icon}</div>
                <div className="feat-text">
                  <h3>{feat.title} {feat.tag && <span className="usp-tag">{feat.tag}</span>}</h3>
                  <p>{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ DEMO PREVIEW ══ */}
      <LandingDemoPreview navigate={navigate} />

      {/* ══ DIFF ══ */}
      <section className="diff-section">
        <p className="section-eyebrow reveal">Kenapa NIKAH RAPI?</p>
        <h2 className="section-title reveal">Beda dari yang lain —<br /><em>Dibuat untuk Pernikahan Indonesia</em></h2>
        <div className="diff-table-wrap reveal">
          <table className="diff-table">
            <thead>
              <tr>
                <th>Fitur</th>
                <th>Wedding Planner Biasa</th>
                <th>NIKAH RAPI ✦</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Seserahan Tracker', false, true],
                ['Kado & Angpao Tracker', false, true],
                ['Budget real-time otomatis', false, true],
                ['Dashboard visual progress', false, true],
                ['Disesuaikan adat Indonesia', false, true],
                ['22+ modul terintegrasi', false, true],
                ['Akses PWA & Offline Support', false, true],
                ['Export & Import Data', false, true],
                ['Honeymoon Planner', false, true]
              ].map((row, i) => (
                <tr key={i}>
                  <td>{row[0]}</td>
                  <td style={{ textAlign: 'center' }}>{row[1] ? '✓' : '✕'}</td>
                  <td style={{ textAlign: 'center' }}>{row[2] ? '✓' : '✕'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ══ TESTIMONI ══ */}
      <section className="testi-section">
        <p className="section-eyebrow reveal">Kata Mereka</p>
        <h2 className="section-title reveal">Dari yang Tadinya Panik —<br />Jadi <em>Tenang Sampai Hari H</em></h2>
        <div className="testi-photo-grid">
          {[
            { emoji: '🌸', bg: 'linear-gradient(135deg,#E8C4B8,#C4857A)', city: 'Jakarta', text: '"Seserahan Tracker-nya beneran game changer! Sebelumnya nyatat manual di kertas, ada yang ketinggalan terus. Sekarang tinggal ceklis, dan bisa di-akses suami juga."', name: 'Anisa R.', role: 'Calon Pengantin · Sept 2025' },
            { emoji: '💑', bg: 'linear-gradient(135deg,#8B5E6A,#C9A96E)', city: 'Bandung', text: '"Berdua bisa update real-time. Saya isi data vendor, calon istri ngurus seserahan, semuanya keliatan di dashboard yang sama. Anti drama \'kok ini belum dibayar\'."', name: 'Reza & Putri', role: 'Pasangan · Nov 2025' },
            { emoji: '👩', bg: 'linear-gradient(135deg,#C9A96E,#8B5E6A)', city: 'Surabaya', text: '"Anak saya di Jakarta, saya di Surabaya. Sejak pakai NIKAH RAPI, semua list seserahan dan keperluan akad bisa saya pantau dari rumah. Tinggal bagi tugas, semua tercatat rapi."', name: 'Bunda Sri W.', role: 'Ibu Calon Pengantin · Jan 2026' }
          ].map((t, i) => (
            <div key={i} className="testi-photo-card reveal">
              <div style={{ height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{ width: 88, height: 88, borderRadius: '50%', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 42, boxShadow: '0 8px 24px rgba(92,61,46,0.15)' }}>
                  {t.emoji}
                </div>
                <div className="testi-photo-badge">📍 {t.city}</div>
              </div>
              <div className="testi-photo-content">
                <div style={{ color: 'var(--gold)', marginBottom: 8, fontSize: 14 }}>★★★★★</div>
                <p className="testi-photo-text">{t.text}</p>
                <div>
                  <div className="testi-photo-name">{t.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 6 }}>{t.role}</div>
                  <div className="testi-photo-verified">✓ Verified Purchase</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="testi-stats reveal">
          <div className="tstat"><div className="tstat-num">22+</div><div style={{ fontSize: 12, color: 'var(--text-light)' }}>Modul Web App</div></div>
          <div className="tstat"><div className="tstat-num">4.9★</div><div style={{ fontSize: 12, color: 'var(--text-light)' }}>Rating dari early users</div></div>
          <div className="tstat"><div className="tstat-num">7 Hari</div><div style={{ fontSize: 12, color: 'var(--text-light)' }}>Garansi Uang Kembali</div></div>
        </div>
      </section>

      {/* ══ PRICING ══ */}
      <section className="pricing-section" id="pricing">
        <p className="section-eyebrow reveal">Lebih murah dari satu bouquet bunga</p>
        <h2 className="section-title reveal">Satu Kali Bayar.<br />Tenang Sampai Hari H.</h2>
        <div className="pricing-card reveal">
          <div className="pricing-card-badge">✦ Akses Premium Seumur Hidup</div>
          <div className="price-hero">
            <div className="price-big"><sup>Rp</sup>129.000</div>
          </div>
          <div className="price-was-p"><s>Rp 299.000</s></div>
          <div className="price-save-badge">🔥 Hemat 57% — Harga Promo Terbatas!</div>
          <ul className="include-list">
            <li>Aplikasi Web NIKAH RAPI — 22+ modul lengkap & terintegrasi</li>
            <li>Seserahan Tracker eksklusif — tidak ada di produk lain!</li>
            <li>Kado & Angpao Tracker eksklusif — follow up terima kasih mudah</li>
            <li>Dashboard otomatis update tanpa input ulang</li>
            <li>Update akses gratis seumur hidup</li>
            <li>Akses dari mana saja (HP, Tablet, Laptop)</li>
          </ul>
          <a
            href={checkoutUrl}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', fontSize: '15px', padding: '22px' }}
          >
            💍 Ya, Saya Mau Nikah dengan Tenang — Rp 129.000
          </a>
          <p className="urgency-note">⏰ Harga promo segera berakhir · Garansi 7 hari uang kembali · Akses instan via WA</p>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section className="faq-section" id="faq">
        <p className="section-eyebrow reveal">Pertanyaan yang sering ditanya</p>
        <h2 className="section-title reveal">FAQ</h2>
        <div className="faq-inner">
          {[
            { q: 'Saya gaptek, bisa pakai tidak?', a: 'Tidak perlu jago teknologi! NIKAH RAPI dirancang agar tinggal isi data — semua kalkulasi dan dashboard berjalan otomatis. Kalau kamu bisa ngetik di HP, kamu sudah bisa pakai NIKAH RAPI.' },
            { q: 'Bisa dibuka di HP atau hanya di laptop?', a: 'Bisa di keduanya! Cukup buka browser di HP atau laptop, login pakai email, dan langsung bisa akses semua fitur. Tidak perlu install aplikasi tambahan.' },
            { q: 'Setelah bayar, link akses dikirim ke mana?', a: 'Link akses dikirim langsung ke WhatsApp kamu setelah pembayaran dikonfirmasi. Akses seumur hidup!' },
            { q: 'Ada garansi uang kembali tidak?', a: 'Ada garansi 7 hari. Jika tidak sesuai deskripsi, hubungi kami dan proses refund penuh tanpa pertanyaan berlebihan.' },
            { q: 'Bisa untuk pernikahan adat apa saja?', a: 'Bisa untuk semua adat — Jawa, Sunda, Minang, Betawi, Modern, dan lainnya. Template kami fleksibel dan bisa disesuaikan.' },
            { q: 'Apa bedanya dengan wedding planner lain?', a: 'NIKAH RAPI adalah satu-satunya Web App wedding planner yang punya Seserahan Tracker & Kado/Angpao Tracker — dua fitur yang paling dibutuhkan calon pengantin Indonesia tapi tidak ada di produk manapun.' }
          ].map((item, i) => (
            <div key={i} className={`faq-item reveal ${openFaq === i ? 'open' : ''}`} onClick={() => toggleFaq(i)}>
              <div className="faq-q">{item.q} <span className="faq-arrow">{openFaq === i ? '−' : '+'}</span></div>
              <div className="faq-a">{item.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section className="final-cta">
        <p className="section-eyebrow reveal" style={{ color: 'var(--blush)' }}>Hari H kamu cuma ada satu kali</p>
        <h2 className="section-title reveal" style={{ color: 'white' }}>Jangan sampai dirusak hal-hal<br />yang seharusnya sudah <em style={{ color: '#E8D5B0' }}>terplan dari awal</em></h2>
        <p className="reveal">Ratusan detail pernikahan dalam satu platform. Budget, vendor, seserahan, tamu, angpao — semua rapi. Supaya hari terbaikmu benar-benar terasa seperti hari terbaik.</p>
        <a href={checkoutUrl} className="btn-secondary reveal" style={{ margin: '0 auto', background: 'white', color: 'var(--mauve)', border: 'none' }}>
          💍 Mulai Sekarang — Sebelum Harga Naik
        </a>
      </section>

      </main>
      <footer style={{ background: '#2C2218', padding: '40px 80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', letterSpacing: '2px' }}>NIKAH RAPI ✦</div>
        <div style={{ fontSize: '12px', opacity: 0.7, display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span>© 2025 NIKAH RAPI · Wedding Planner Digital Premium · Made with love 🤍</span>
          <a href="/privacy" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)' }}>Kebijakan Privasi</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingMain;
