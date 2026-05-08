import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingMain.css';

const LandingMain = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('p-dash');
  const [openFaq, setOpenFaq] = useState(null);

  // Link Checkout Scalev
  const checkoutUrl = "https://entrepreneurai.myscalev.com/checkout-page";

  // Intersection Observer for Scroll Reveal
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    return () => {
      revealElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const tabs = [
    { id: 'p-dash', label: '🏠 Dashboard', img: 'dashboard.png' },
    { id: 'p-ses', label: '💍 Seserahan ✦', img: 'seserahan.png' },
    { id: 'p-kado', label: '🎁 Kado & Angpao ✦', img: 'kadoangpao.png' },
    { id: 'p-budget', label: '💰 Budget', img: 'budget.png' },
    { id: 'p-guest', label: '👥 Guest List', img: 'guestlist.png' },
    { id: 'p-vendor', label: '🏢 Vendor', img: 'vendor.png' },
  ];

  return (
    <div className="landing-container">
      {/* ══ STICKY CTA ══ */}
      <a href={checkoutUrl} className="sticky-cta show">
        💍 Dapatkan Sekarang — Rp 99.000
      </a>

      {/* ══ HERO ══ */}
      <section className="hero">
        <div className="badge">Wedding Planner Premium</div>
        <p className="hero-eyebrow">Untuk kamu yang mau nikah tanpa drama & panik</p>
        <h1 className="hero-title">
          Nikah Tanpa <em>Drama Vendor Cabut,</em><br />
          Budget Jebol & Seserahan Ketinggalan
        </h1>
        <p className="hero-hook">
          "Kamu berhak menikmati setiap detik persiapan nikahmu —<br />
          bukan menghabiskannya untuk panik, cari-cari catatan, dan khawatir ada yang terlupa."
        </p>
        <p className="hero-title-sub">
          Semua persiapan pernikahan — terkontrol rapi dalam 1 platform. Cukup isi datanya, sistem yang bekerja.
        </p>
        <div className="drama-tags">
          <span className="drama-tag">😰 Drama Budget Bocor</span>
          <span className="drama-tag">📋 Drama Seserahan Kacau</span>
          <span className="drama-tag">🏢 Drama Vendor Susah Ditracking</span>
        </div>

        <div className="preview-tabs">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              className={`ptab ${activeTab === tab.id ? 'on' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
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
            <div className="sheet-tabs-bar">
              {tabs.map(tab => (
                <button 
                  key={tab.id}
                  className={`stab ${activeTab === tab.id ? 'on' : ''} ${tab.id === 'p-kado' ? 'gold' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            {tabs.map(tab => (
              <div key={tab.id} className={`preview-stage ${activeTab === tab.id ? 'on' : ''}`}>
                <img 
                  src={`/landing-assets/${tab.img}`} 
                  alt={tab.label} 
                  width="900" 
                  height="500"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="hero-cta-block">
          <div className="price-display">
            <div className="price-new"><sup style={{ fontSize: '22px' }}>Rp</sup>99.000</div>
            <div className="price-old"><s>Rp 299.000</s></div>
            <div className="price-save">HEMAT 63%</div>
          </div>
          
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px' }}>
            <a href={checkoutUrl} className="btn-primary">💍 Klaim Slot Early Bird Sekarang</a>
            <button 
              onClick={() => navigate('/demo')} 
              className="btn-secondary"
              style={{ background: 'rgba(139, 94, 106, 0.1)', border: '1px solid var(--mauve)', color: 'var(--mauve)', padding: '20px 40px' }}
            >
              👁️ Lihat Simulasi App
            </button>
          </div>

          <div style={{ background: 'linear-gradient(135deg,#fff8ec 0%,#ffe7d6 100%)', border: '1px solid #C9A96E', borderRadius: '16px', padding: '20px 24px', margin: '32px auto', maxWidth: '540px', textAlign: 'center', boxShadow: '0 8px 24px rgba(201,169,110,0.15)' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8B5E6A', fontWeight: '600', marginBottom: '8px' }}>
              ⏰ Promo Early Bird Berakhir Saat Slot Habis
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '28px', color: '#5C3D2E', fontWeight: '600', marginBottom: '4px' }}>
              Tersisa <span style={{ color: '#B85C00', fontWeight: '700' }}>10</span> dari 50 Slot
            </div>
            <div style={{ fontSize: '13px', color: '#6B5A4F', marginBottom: '12px' }}>
              Harga akan naik ke <s>Rp 299.000</s> setelah slot habis
            </div>
            <div style={{ background: 'rgba(201,169,110,0.2)', height: '8px', borderRadius: '100px', overflow: 'hidden', marginTop: '12px' }}>
              <div style={{ background: 'linear-gradient(90deg,#B85C00,#C9A96E)', height: '100%', width: '20%', transition: 'width 0.5s ease' }}></div>
            </div>
          </div>

          <div className="cta-notes">
            <div className="cta-note-item">✓ Garansi 7 hari</div>
            <div className="cta-note-item">✓ Akses instan Web App</div>
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
          <span><strong>Tersisa 10 slot</strong> dari 50 Early Bird</span>
        </div>
      </section>

      {/* ══ VIDEO SECTION ══ */}
      <section className="video-section">
        <p className="section-eyebrow reveal">✨ Intip Dulu Sebelum Beli</p>
        <h2 className="section-title reveal">Lihat <em>Cara Kerjanya</em></h2>
        <p className="video-sub reveal">
          Tidak perlu download aplikasi apapun. Akses langsung via browser, data otomatis tersinkronisasi secara real-time.
        </p>
        <div className="video-wrapper reveal">
          <div className="video-placeholder">
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
              <h4>Seserahan Tracker <span className="usp-tag">Eksklusif</span></h4>
              <p>Catat item, harga, status, auto-hitung total.</p>
            </div>
          </div>
          <div className="vf-card">
            <div className="vf-icon">🎁</div>
            <div className="vf-text">
              <h4>Kado & Angpao Tracker <span className="usp-tag">Eksklusif</span></h4>
              <p>Siapa beri apa, nominal, follow up ucapan.</p>
            </div>
          </div>
          <div className="vf-card">
            <div className="vf-icon">💰</div>
            <div className="vf-text">
              <h4>Budget Planner</h4>
              <p>Rencana vs realisasi, update otomatis real-time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ DRAMA ══ */}
      <section className="drama-section">
        <p className="section-eyebrow reveal">Cerita yang terlalu familiar...</p>
        <h2 className="section-title reveal">Drama Menuju Pernikahan<br />yang <em>Bikin Capek Sebelum Hari H</em></h2>
        <div className="drama-grid">
          {[
            { icon: '💰', title: 'Drama Budget Jebol', desc: 'Estimasi Rp 80jt, realisasi Rp 120jt. Pengeluaran kecil-kecil yang tidak tercatat akhirnya numpuk tanpa disadari.', scenario: '"Udah bayar DP katering, eh lupa dicatat. Sekarang gak tau sisa budget berapa."' },
            { icon: '💍', title: 'Drama Seserahan Ketinggalan', desc: 'Daftar seserahan ditulis di kertas, notes HP, chat WA — tersebar mana-mana. Hari H ada barang yang ketinggalan.', scenario: '"Sampai di lokasi baru sadar parfum seserahan ketinggalan di rumah. Panik!"' },
            { icon: '🏢', title: 'Drama Vendor Tiba-tiba Cabut', desc: 'Vendor cancel H-7, nomor susah dihubungi, kontrak tidak jelas. Semua info vendor tersebar di berbagai chat WA.', scenario: '"WO tiba-tiba bilang ada double booking. Kontraknya mana? Sudah bayar berapa?"' },
            { icon: '💄', title: 'Drama MUA Double Booking', desc: 'MUA impian ternyata sudah di-booking orang lain di tanggal yang sama. Baru ketahuan 2 minggu sebelum hari H.', scenario: '"Udah fitting 3x, eh MUA-nya bilang double booking. Cari pengganti mendadak."' },
            { icon: '🎁', title: 'Drama Kado & Angpao Kacau', desc: 'Siapa yang kasih kado apa? Amplop dari siapa? Mau kirim ucapan terima kasih tapi datanya tidak ada sama sekali.', scenario: '"Mau WA ucapan terima kasih tapi lupa siapa yang kasih angpao berapa. Awkward."' },
            { icon: '😫', title: 'Drama Tamu Melebihi Kapasitas', desc: 'Undangan 300 orang, kursi cuma 250. Konfirmasi hadir berantakan, catering kurang, meja tidak cukup.', scenario: '"Tamu yang konfirmasi hadir ternyata lebih dari kapasitas gedung. Chaos!"' }
          ].map((item, i) => (
            <div key={i} className="drama-card reveal">
              <span className="drama-icon">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <div className="drama-scenario">{item.scenario}</div>
            </div>
          ))}
        </div>
        <p className="drama-closer reveal">"Semua drama ini bisa dihindari — kalau semua tercatat di satu tempat yang benar."</p>
      </section>

      {/* ══ SOLUTION ══ */}
      <section className="solution-section">
        <div className="solution-inner">
          <div className="solution-left">
            <p className="section-eyebrow reveal">Solusi yang kamu butuhkan</p>
            <h2 className="section-title reveal">Satu platform.<br />Semua drama<br />bisa dicegah.</h2>
            <p className="reveal">
              NIKAH RAPI dirancang khusus untuk calon pengantin Indonesia — 22+ modul Web App terintegrasi yang saling terhubung otomatis. 
              Input sekali, semua terupdate. Tersinkronisasi cloud, aman, dan bisa diakses dari perangkat manapun.
            </p>
            <a href="#pricing" className="btn-secondary reveal">Lihat Harga & Paket →</a>
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
                  <h4>{feat.title} {feat.tag && <span className="usp-tag">{feat.tag}</span>}</h4>
                  <p>{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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

      {/* ══ PRICING ══ */}
      <section className="pricing-section" id="pricing">
        <p className="section-eyebrow reveal">Investasi terkecil untuk pernikahan terbaik</p>
        <h2 className="section-title reveal">Dapatkan NIKAH RAPI Sekarang</h2>
        <div className="pricing-card reveal">
          <div className="pricing-card-badge">✦ Akses Premium Seumur Hidup</div>
          <div className="price-hero">
            <div className="price-big"><sup>Rp</sup>99.000</div>
          </div>
          <div className="price-was-p"><s>Rp 299.000</s></div>
          <div className="price-save-badge">🔥 Hemat 63% — Harga Promo Terbatas!</div>
          <ul className="include-list">
            <li>Aplikasi Web NIKAH RAPI — 22+ modul lengkap & terintegrasi</li>
            <li>Seserahan Tracker eksklusif — tidak ada di produk lain!</li>
            <li>Kado & Angpao Tracker eksklusif — follow up terima kasih mudah</li>
            <li>Dashboard otomatis update tanpa input ulang</li>
            <li>Update akses gratis seumur hidup</li>
            <li>Akses dari mana saja (HP, Tablet, Laptop)</li>
          </ul>
          <a href={checkoutUrl} className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '15px', padding: '22px' }}>
            💍 Dapatkan Sekarang — Rp 99.000
          </a>
          <p className="urgency-note">⏰ Harga segera naik ke Rp 299.000 · Garansi 7 hari · Akses langsung via WA</p>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section className="faq-section">
        <p className="section-eyebrow reveal">Pertanyaan yang sering ditanya</p>
        <h2 className="section-title reveal">FAQ</h2>
        <div className="faq-inner">
          {[
            { q: 'Saya gaptek, bisa pakai tidak?', a: 'Tidak perlu jago teknologi! NIKAH RAPI dirancang agar tinggal isi data — semua kalkulasi dan dashboard berjalan otomatis.' },
            { q: 'Bisa dibuka di HP atau hanya di laptop?', a: 'Bisa di keduanya! Cukup buka browser di HP atau laptop, login pakai email, dan langsung bisa akses.' },
            { q: 'Setelah bayar, link akses dikirim ke mana?', a: 'Link akses dikirim langsung ke email kamu setelah pembayaran dikonfirmasi. Akses seumur hidup!' },
            { q: 'Ada garansi uang kembali tidak?', a: 'Ada garansi 7 hari. Jika tidak sesuai deskripsi, hubungi kami untuk refund penuh.' }
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
        <p className="section-eyebrow reveal">Sudah siap?</p>
        <h2 className="section-title reveal">Mulai rencanakan pernikahanmu<br />dengan lebih <em style={{ color: '#E8D5B0' }}>tenang & rapi</em></h2>
        <p className="reveal">Ratusan detail pernikahan dalam satu file. Supaya hari terbaikmu benar-benar terasa seperti hari terbaik.</p>
        <a href={checkoutUrl} className="btn-secondary reveal" style={{ margin: '0 auto' }}>
          💍 Ambil Sekarang Sebelum Harga Naik
        </a>
      </section>

      <footer style={{ background: '#2C2218', padding: '40px 80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', letterSpacing: '2px' }}>NIKAH RAPI ✦</div>
        <div style={{ fontSize: '12px', opacity: 0.4 }}>© 2025 NIKAH RAPI · Wedding Planner Digital Premium</div>
      </footer>
    </div>
  );
};

export default LandingMain;
