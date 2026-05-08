import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingNav from '../../components/landing/LandingNav';
import LandingDemoPreview from '../../components/landing/LandingDemoPreview';
import SEO from '../../components/SEO';
import './LandingMain.css';
import './LandingPria.css';

const LandingPria = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);
  const checkoutUrl = "https://entrepreneurai.myscalev.com/checkout-page";

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    const els = document.querySelectorAll('.reveal');
    els.forEach(el => observer.observe(el));
    return () => els.forEach(el => observer.unobserve(el));
  }, []);

  const navLinks = [
    { label: 'Masalah Pria', href: '#masalah' },
    { label: 'Fitur', href: '#fitur' },
    { label: 'Harga', href: '#pricing' },
    { label: 'FAQ', href: '#faq' }
  ];

  return (
    <div className="landing-container" style={{ paddingTop: '70px' }}>
      <SEO
        title="Nikah Anti Boncos — Budget Terkontrol Sampai Hari H | NIKAH RAPI untuk Pria"
        description="Untuk calon suami yang mau pegang kendali. Pantau budget nikah, DP vendor, dan progress persiapan dari HP. 22+ modul terintegrasi. Rp 99.000 sekali bayar, akses seumur hidup."
        path="/untuk-pria"
        keywords="budget pernikahan pria, calon suami persiapan nikah, kontrol budget nikah, wedding planner untuk pria, vendor pernikahan tracking, nikah anti boncos"
      />
      <LandingNav links={navLinks} />

      {/* ══ HERO ══ */}
      <section className="hero">
        <div className="badge">✦ Untuk Calon Suami yang Mau Pegang Kendali</div>
        <p className="hero-eyebrow">Karena nikah itu bukan cuma urusan istri</p>
        <h1 className="hero-title">
          Nikah Anti Boncos.<br />
          <em>Budget Terkontrol</em> Sampai Hari H.
        </h1>
        <p className="hero-hook">
          "Kamu yang bayar, kamu yang harus tau ke mana uangnya pergi.<br />
          NIKAH RAPI kasih kamu visibility 100% atas budget, vendor, dan progress — langsung dari HP."
        </p>
        <p className="hero-title-sub">
          Tracking real-time · DP & pelunasan vendor terpantau · Bisa share dashboard ke pasangan
        </p>
        <div className="drama-tags">
          <span className="drama-tag">💸 Budget Bocor Halus</span>
          <span className="drama-tag">🤷 Gak Tau Vendor Udah Lunas</span>
          <span className="drama-tag">📉 Tabungan Habis Sebelum H-1</span>
        </div>

        <div className="product-showcase">
          <div className="showcase-glow"></div>
          <div className="float-badge float-badge-top">
            <div className="fb-icon" style={{ background: '#FFF0EC' }}>💰</div>
            <div>
              <div className="fb-label">Budget Planner</div>
              <div className="fb-val">Rp 95.5jt / 120jt terkontrol ✓</div>
            </div>
          </div>
          <div className="float-badge float-badge-bot">
            <div className="fb-icon" style={{ background: '#F0F4F0' }}>🏢</div>
            <div>
              <div className="fb-label">Vendor Manager</div>
              <div className="fb-val">8/10 vendor lunas ✓</div>
            </div>
          </div>
          <div className="browser-frame">
            <div className="browser-bar">
              <div className="browser-dots"><div className="browser-dot" style={{background:'#ff5f57'}}></div><div className="browser-dot" style={{background:'#febc2e'}}></div><div className="browser-dot" style={{background:'#28c840'}}></div></div>
              <div className="browser-url">app.nikahrapi.online ✦</div>
            </div>
            <div className="preview-stage on">
              <img src="/landing-assets/dashboard.png" alt="Dashboard NIKAH RAPI" width="900" height="500" />
            </div>
          </div>
        </div>

        <div className="hero-cta-block">
          <div className="price-display">
            <div className="price-new"><sup style={{fontSize:'22px'}}>Rp</sup>99.000</div>
            <div className="price-old"><s>Rp 299.000</s></div>
            <div className="price-save">HEMAT 63%</div>
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px' }}>
            <a href={checkoutUrl} className="btn-primary">⚡ Ambil Kendali Budget Sekarang →</a>
            <button onClick={() => navigate('/demo')} className="btn-secondary">
              📊 Lihat Cara Kerjanya
            </button>
          </div>
          <div className="cta-notes">
            <div className="cta-note-item">✓ Sekali bayar, akses seumur hidup</div>
            <div className="cta-note-item">✓ Garansi 7 hari uang kembali</div>
            <div className="cta-note-item">✓ Akses dari HP kapan saja</div>
          </div>
        </div>

        <div className="social-proof-bar">
          <div className="sp-avatars">
            <div className="sp-avatar" style={{ background: 'linear-gradient(135deg,#5C7361,#8BAF8B)' }}>💼</div>
            <div className="sp-avatar" style={{ background: 'linear-gradient(135deg,#C9A96E,#E8D5B0)' }}>🔥</div>
            <div className="sp-avatar" style={{ background: 'linear-gradient(135deg,#8B5E6A,#C4857A)' }}>⚡</div>
            <div className="sp-avatar" style={{ background: 'linear-gradient(135deg,#A8B8AC,#7A8C7E)' }}>🎯</div>
          </div>
          <div className="stars">★★★★★</div>
          <span>Dipercaya calon suami Indonesia</span>
        </div>
      </section>

      {/* ══ DRAMA (PRIA VERSION) ══ */}
      <section className="drama-section" id="masalah">
        <p className="section-eyebrow reveal">Masalah yang terlalu sering terjadi...</p>
        <h2 className="section-title reveal">Jangan Sampai Dana Nikah<br /><em>Menguap Tanpa Jejak</em></h2>
        <div className="drama-grid">
          {[
            { icon: '💸', title: 'Budget Bocor Halus', desc: 'Pengeluaran kecil yang tidak tercatat tahu-tahu bikin tabungan minus. Total Rp 120jt, realisasi entah berapa.', scenario: '"Eh kok tabungan nikah tinggal segini? Kemarin kan masih banyak... pengeluaran apa aja sih?"' },
            { icon: '🤯', title: 'Koordinasi Vendor Rumit', desc: 'Capek tanya "ini sudah lunas belum?" ke pasangan. DP katering, pelunasan gedung, cicilan MUA — semua di chat WA yang berbeda.', scenario: '"Vendor fotografer bilang belum lunas, tapi kamu bilang udah transfer. Buktinya mana?"' },
            { icon: '📊', title: 'Gak Tahu Progress', desc: 'Persiapan sudah berapa persen? Apa yang urgent? Semua tersebar di notes, Excel, dan kepala — tidak ada satu dashboard.', scenario: '"Pasangan nanya udah sampai mana, kamu cuma bisa jawab \'lagi diproses\'. Gak ada datanya."' },
            { icon: '🏢', title: 'Vendor Cancel Mendadak', desc: 'Vendor tiba-tiba cancel H-7, nomor susah dihubungi. Kontrak dan bukti DP tidak tersimpan rapi.', scenario: '"WO bilang double booking. Bukti kontraknya? Di chat WA yang udah ketimpa ribuan pesan."' },
            { icon: '💍', title: 'Seserahan Berantakan', desc: 'List seserahan ditulis di kertas, notes HP, dan chat WA. Hari H ada barang yang ketinggalan karena gak ada satu daftar resmi.', scenario: '"Sampai di rumah mertua baru sadar parfum seserahan ketinggalan. Malu bukan main."' },
            { icon: '😤', title: 'Ribut Soal Uang', desc: 'Pasangan merasa kamu gak transparan soal keuangan nikah. Padahal kamu juga bingung karena datanya tersebar.', scenario: '"Aku udah transfer berapa kali buat nikah ini, kamu gak pernah kasih laporan jelas."' }
          ].map((item, i) => (
            <div key={i} className="drama-card reveal">
              <span className="drama-icon">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <div className="drama-scenario">{item.scenario}</div>
            </div>
          ))}
        </div>
        <p className="drama-closer reveal">"Semua drama ini bisa dihindari — kalau kamu punya sistem yang proper untuk tracking semuanya."</p>
      </section>

      {/* ══ SOLUTION ══ */}
      <section className="solution-section" id="fitur">
        <div className="solution-inner">
          <div className="solution-left">
            <p className="section-eyebrow reveal" style={{ color: 'var(--blush)' }}>Solusi yang calon suami butuhkan</p>
            <h2 className="section-title reveal">Satu platform.<br />Ambil alih kendali<br />tanpa repot.</h2>
            <p className="reveal">
              NIKAH RAPI dirancang khusus untuk mengontrol 22+ aspek pernikahan secara terpusat. 
              Sebagai pengambil keputusan, kamu bisa memantau budget, DP vendor, dan persentase progress langsung dari HP.
            </p>
            <a href="#pricing" className="btn-secondary reveal" style={{ background: 'white', color: 'var(--mauve)', border: 'none' }}>Lihat Harga & Paket →</a>
          </div>
          <div className="feature-cards">
            {[
              { icon: '💰', title: 'Budget Planner Otomatis', desc: 'Rencana vs realisasi terupdate real-time. Tahu persis mana yang mulai overbudget sebelum terlambat.' },
              { icon: '🏢', title: 'Vendor Manager Lengkap', desc: 'Pantau histori cicilan DP dan deadline pelunasan vendor. Tidak ada lagi vendor yang "lupa" perjanjian.' },
              { icon: '💍', title: 'Seserahan Tracker', tag: 'Eksklusif', desc: 'Catat barang apa saja yang sudah dibeli dan berapa sisa budgetnya. Auto-hitung total.' },
              { icon: '🎁', title: 'Kado & Angpao Tracker', tag: 'Eksklusif', desc: 'Rekap siapa beri apa, nominal angpao. Pencatatan terpusat mencegah kehilangan data.' }
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
        <h2 className="section-title reveal">Alat cerdas untuk<br /><em>Pria yang Sistematis</em></h2>
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

      {/* ══ TESTIMONI PRIA ══ */}
      <section className="testi-section">
        <p className="section-eyebrow reveal">Dari Para Calon Suami</p>
        <h2 className="section-title reveal">Pria Lain Sudah <em>Ambil Kendali</em></h2>
        <div className="testi-photo-grid">
          {[
            { emoji: '💼', bg: 'linear-gradient(135deg,#5C7361,#8BAF8B)', city: 'Jakarta', text: '"Gue orangnya sistematis. NIKAH RAPI cocok banget — semua vendor, budget, dan deadline ada di satu dashboard. Pasangan gue juga bisa akses, jadi gak ada lagi drama \'kok gak transparan\'."', name: 'Reza A.', role: 'Calon Pengantin · Nov 2025' },
            { emoji: '⚡', bg: 'linear-gradient(135deg,#C9A96E,#8B5E6A)', city: 'Bandung', text: '"Budget planner-nya beneran game changer. Gue bisa lihat persis kategori mana yang mulai overbudget. Estimasi 80jt, realisasi bisa dikontrol di 82jt. Tanpa ini pasti jebol."', name: 'Dimas P.', role: 'Calon Pengantin · Jan 2026' },
            { emoji: '🎯', bg: 'linear-gradient(135deg,#8B5E6A,#C9A96E)', city: 'Surabaya', text: '"Awalnya skeptis — cowok kok pakai wedding planner app. Tapi setelah coba, ini lebih ke financial tracker + project manager buat nikah. Exactly what I needed."', name: 'Ari W.', role: 'Calon Pengantin · Mar 2026' }
          ].map((t, i) => (
            <div key={i} className="testi-photo-card reveal">
              <div style={{ height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{ width: 88, height: 88, borderRadius: '50%', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 42, boxShadow: '0 8px 24px rgba(92,61,46,0.15)' }}>{t.emoji}</div>
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
        <p className="section-eyebrow reveal">Investasi terkecil untuk efisiensi budget jutaan rupiah</p>
        <h2 className="section-title reveal">Dapatkan Akses Sekarang</h2>
        <div className="pricing-card reveal">
          <div className="pricing-card-badge">✦ Akses Premium Seumur Hidup</div>
          <div className="price-hero"><div className="price-big"><sup>Rp</sup>99.000</div></div>
          <div className="price-was-p"><s>Rp 299.000</s></div>
          <div className="price-save-badge">🔥 Hemat 63% — Harga Promo Terbatas!</div>
          <ul className="include-list">
            <li>Aplikasi Web NIKAH RAPI — 22+ modul lengkap & terintegrasi</li>
            <li>Budget Planner otomatis — kontrol penuh atas keuangan nikah</li>
            <li>Vendor Manager — tracking DP, cicilan, dan pelunasan</li>
            <li>Seserahan & Kado/Angpao Tracker eksklusif</li>
            <li>Update akses gratis seumur hidup</li>
            <li>Akses multi-device (Bisa dibuka di HP kamu & pasangan)</li>
          </ul>
          <a href={checkoutUrl} className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '15px', padding: '22px' }}>
            ⚡ Amankan Promo Sekarang — Rp 99.000
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
            { q: 'Apakah aman dari kehilangan data?', a: 'Sangat aman. Semua data tersimpan di Cloud otomatis, tidak seperti Excel yang bisa corrupt atau hilang file-nya.' },
            { q: 'Bisa dibuka di HP?', a: 'Bisa! Bahkan kamu dan pasangan bisa buka aplikasinya di HP masing-masing dan datanya akan tersinkronisasi real-time.' },
            { q: 'Sekali bayar atau berlangganan?', a: 'Sekali bayar untuk akses seumur hidup. Tidak ada biaya bulanan lagi.' },
            { q: 'Ada garansi uang kembali?', a: 'Ada garansi 7 hari. Jika merasa tidak berguna untuk mengontrol persiapan pernikahanmu, kami kembalikan 100%.' },
            { q: 'Ini bukan cuma "wedding planner cewek"?', a: 'Bukan. NIKAH RAPI itu lebih ke financial tracker + project manager untuk pernikahan. Budget planner, vendor manager, deadline tracking — tools yang pria butuhkan.' },
            { q: 'Pasangan saya juga bisa akses?', a: 'Bisa! Satu akun bisa diakses dari 2 device berbeda. Jadi kamu dan pasangan bisa kolaborasi real-time tanpa kirim-kiriman screenshot.' }
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
        <p className="section-eyebrow reveal" style={{ color: 'var(--blush)' }}>Ambil Kendali Sekarang</p>
        <h2 className="section-title reveal" style={{ color: 'white' }}>Pernikahan terkontrol dimulai<br />dari <em style={{ color: '#E8D5B0' }}>pria yang terencana</em></h2>
        <p className="reveal">Kurangi drama, tekan pengeluaran tak terduga, dan pastikan hari bahagiamu berjalan sesuai rencana.</p>
        <a href={checkoutUrl} className="btn-secondary reveal" style={{ margin: '0 auto', background: 'white', color: 'var(--mauve)', border: 'none' }}>
          ⚡ Dapatkan NIKAH RAPI Sekarang
        </a>
      </section>

      <footer style={{ background: '#2C2218', padding: '40px 80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', letterSpacing: '2px' }}>NIKAH RAPI ✦</div>
        <div style={{ fontSize: '12px', opacity: 0.4 }}>© 2025 NIKAH RAPI · Untuk Pria Terencana Indonesia 🤍</div>
      </footer>
    </div>
  );
};

export default LandingPria;
