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

  const checkoutUrl = "https://entrepreneurai.myscalev.com/checkout-page";

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
        description="Atur semua persiapan pernikahan di 1 Web App. Budget planner otomatis, seserahan tracker, vendor manager, kado & angpao tracker. 22+ modul terintegrasi. Rp 99.000 akses seumur hidup."
        path="/"
        keywords="wedding planner indonesia, persiapan nikah, budget pernikahan, seserahan tracker, vendor pernikahan, aplikasi nikah, wedding organizer digital"
      />
      <LandingNav />

      {/* ══ HERO ══ */}
      <section className="hero">
        <div className="badge">✦ Wedding Planner Khusus Pernikahan Indonesia</div>
        <p className="hero-eyebrow">Untuk kamu yang mau menikah dengan tenang, terorganisir, dan tetap hemat</p>
        <h1 className="hero-title">
          Atur Semua Persiapan Nikahmu di <em>1 Web App</em><br />
          — Dari Budget Sampai Seserahan
        </h1>
        <p className="hero-hook">
          "Stop pakai 5 spreadsheet berbeda yang bikin pusing.<br />
          NIKAH RAPI rapikan budget, vendor, tamu, seserahan, dan angpao kamu — semua di 1 dashboard."
        </p>
        <p className="hero-title-sub">
          22 modul terintegrasi · Otomatis kalkulasi · Bisa diakses berdua dengan pasangan
        </p>
        <div className="drama-tags">
          <span className="drama-tag">😰 Budget Bocor</span>
          <span className="drama-tag">📋 Seserahan Kacau</span>
          <span className="drama-tag">🏢 Vendor Susah Ditrack</span>
          <span className="drama-tag">🎁 Angpao Hilang Data</span>
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
              <img src="/landing-assets/dashboard.png" alt="Dashboard NIKAH RAPI" width="900" height="500" />
            </div>
          </div>
        </div>

        <div className="hero-cta-block">
          <div className="price-display">
            <div className="price-new"><sup style={{ fontSize: '22px' }}>Rp</sup>99.000</div>
            <div className="price-old"><s>Rp 299.000</s></div>
            <div className="price-save">HEMAT 63%</div>
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px' }}>
            <a href={checkoutUrl} className="btn-primary">💍 Mulai Rapikan Pernikahanmu →</a>
            <button onClick={() => navigate('/demo')} className="btn-secondary">
              👁️ Coba Demo Dulu (Gratis)
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
          <span>Dipercaya pasangan Indonesia</span>
        </div>
      </section>

      {/* ══ VIDEO SECTION ══ */}
      <section className="video-section" id="cara-kerja">
        <p className="section-eyebrow reveal">✨ Intip Dulu Sebelum Beli</p>
        <h2 className="section-title reveal">Lihat <em>Cara Kerjanya</em></h2>
        <p className="video-sub reveal">
          Tidak perlu download aplikasi apapun. Akses langsung via browser, data otomatis tersinkronisasi secara real-time.
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
        <h2 className="section-title reveal">Drama Menuju Pernikahan <br />yang <em>Bikin Capek Sebelum Hari H</em></h2>
        <div className="drama-grid">
          {[
            { icon: '💰', title: 'Drama Budget Jebol', desc: 'Estimasi Rp 80jt, realisasi Rp 120jt. Pengeluaran kecil-kecil yang tidak tercatat akhirnya numpuk tanpa disadari.', scenario: '"Udah bayar DP katering, eh lupa dicatat. Sekarang gak tau sisa budget berapa."' },
            { icon: '💍', title: 'Drama Seserahan Ketinggalan', desc: 'Daftar seserahan ditulis di kertas, notes HP, chat WA — tersebar mana-mana. Hari H ada barang yang ketinggalan.', scenario: '"Sampai di lokasi baru sadar parfum seserahan ketinggalan di rumah. Panik!"' },
            { icon: '🏢', title: 'Drama Vendor Cabut', desc: 'Vendor cancel H-7, nomor susah dihubungi, kontrak tidak jelas. Semua info vendor tersebar di berbagai chat WA.', scenario: '"WO tiba-tiba bilang ada double booking. Kontraknya mana? Sudah bayar berapa?"' },
            { icon: '💄', title: 'Drama MUA Double Booking', desc: 'MUA impian ternyata sudah di-booking orang lain di tanggal yang sama. Baru ketahuan 2 minggu sebelum hari H.', scenario: '"Udah fitting 3x, eh MUA-nya bilang double booking. Cari pengganti mendadak."' },
            { icon: '🎁', title: 'Drama Kado & Angpao Kacau', desc: 'Siapa yang kasih kado apa? Amplop dari siapa? Mau kirim ucapan terima kasih tapi datanya tidak ada.', scenario: '"Mau WA ucapan terima kasih tapi lupa siapa yang kasih angpao berapa. Awkward."' },
            { icon: '😫', title: 'Drama Tamu Overload', desc: 'Undangan 300 orang, kursi cuma 250. Konfirmasi hadir berantakan, catering kurang, meja tidak cukup.', scenario: '"Tamu yang konfirmasi hadir ternyata lebih dari kapasitas gedung. Chaos!"' }
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
      <section className="solution-section" id="fitur">
        <div className="solution-inner">
          <div className="solution-left">
            <p className="section-eyebrow reveal" style={{ color: 'var(--blush)' }}>Solusi yang kamu butuhkan</p>
            <h2 className="section-title reveal">Satu platform.<br />Semua drama<br />bisa dicegah.</h2>
            <p className="reveal">
              NIKAH RAPI dirancang khusus untuk calon pengantin Indonesia — 22+ modul Web App terintegrasi yang saling terhubung otomatis. 
              Input sekali, semua terupdate. Tersinkronisasi cloud, aman, dan bisa diakses berdua dari perangkat manapun.
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
                  <h4>{feat.title} {feat.tag && <span className="usp-tag">{feat.tag}</span>}</h4>
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
        <p className="section-eyebrow reveal">Cerita Mereka</p>
        <h2 className="section-title reveal">Sudah Membantu Calon Pengantin <em>Indonesia</em></h2>
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
        <p className="section-eyebrow reveal" style={{ color: 'var(--blush)' }}>Sudah siap?</p>
        <h2 className="section-title reveal" style={{ color: 'white' }}>Mulai rencanakan pernikahanmu<br />dengan lebih <em style={{ color: '#E8D5B0' }}>tenang & rapi</em></h2>
        <p className="reveal">Ratusan detail pernikahan dalam satu platform. Supaya hari terbaikmu benar-benar terasa seperti hari terbaik.</p>
        <a href={checkoutUrl} className="btn-secondary reveal" style={{ margin: '0 auto', background: 'white', color: 'var(--mauve)', border: 'none' }}>
          💍 Ambil Sekarang Sebelum Harga Naik
        </a>
      </section>

      <footer style={{ background: '#2C2218', padding: '40px 80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', letterSpacing: '2px' }}>NIKAH RAPI ✦</div>
        <div style={{ fontSize: '12px', opacity: 0.4 }}>© 2025 NIKAH RAPI · Wedding Planner Digital Premium · Made with love 🤍</div>
      </footer>
    </div>
  );
};

export default LandingMain;
