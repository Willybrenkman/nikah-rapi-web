import React from 'react';

export default function NikahRapiLanding() {
    return (
        <>
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
                media="print"
                onLoad={e => { e.currentTarget.media = 'all' }}
            />
            <style>
                {`

                :root {
                    --rose: #C9856A;
                    --rose-dark: #8B5045;
                    --rose-light: #EAA898;
                    --gold: #C9A96E;
                    --cream: #FDFAF6;
                    --cream2: #FFF5EF;
                    --white: #FFFFFF;
                    --text: #1E1410;
                    --text-soft: #7A6A60;
                    --text-muted: #A89880;
                    --border: #EDE0D4;
                    --green: #3BAD6A;
                }

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                .nikah-rapi-landing-container {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    background: var(--cream);
                    color: var(--text);
                    max-width: 480px;
                    margin: 0 auto;
                    font-size: 15px;
                    line-height: 1.6;
                    min-height: 100vh;
                }

                /* ── HOOK 1 ── */
                .hook1 {
                    background: var(--white);
                    padding: 44px 24px 32px;
                    text-align: center;
                    border-bottom: 1px solid var(--border);
                }

                .hook1-quote {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(22px, 6.5vw, 32px);
                    font-weight: 700;
                    line-height: 1.3;
                    color: var(--text);
                    margin-bottom: 0;
                }

                .hook1-quote em {
                    font-style: italic;
                    color: var(--rose);
                }

                .hook1-quote .green {
                    color: var(--green);
                    font-style: normal;
                }

                .hook1-dash {
                    display: block;
                    width: 40px;
                    height: 2px;
                    background: linear-gradient(90deg, var(--rose), var(--gold));
                    margin: 18px auto;
                    border-radius: 2px;
                }

                /* ── PRODUCT IMAGE ── */
                .product-section {
                    background: var(--white);
                    padding: 0 24px 28px;
                    border-bottom: 1px solid var(--border);
                }

                /* PLACEHOLDER — swap dengan foto produk asli */
                .product-placeholder {
                    background: linear-gradient(135deg, #F5EDE8 0%, #EDD8CC 50%, #F0E0D5 100%);
                    border-radius: 16px;
                    border: 1px solid var(--border);
                    height: 260px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 8px 40px rgba(139, 80, 69, 0.1);
                }

                .product-placeholder::before {
                    content: '';
                    position: absolute;
                    top: -40px;
                    right: -40px;
                    width: 160px;
                    height: 160px;
                    background: radial-gradient(circle, rgba(201, 133, 106, 0.2), transparent 70%);
                }

                .product-placeholder::after {
                    content: '';
                    position: absolute;
                    bottom: -30px;
                    left: -30px;
                    width: 120px;
                    height: 120px;
                    background: radial-gradient(circle, rgba(201, 169, 110, 0.15), transparent 70%);
                }

                .placeholder-ico {
                    font-size: 40px;
                    position: relative;
                    z-index: 1;
                }

                .placeholder-text {
                    font-size: 13px;
                    color: var(--rose-dark);
                    font-weight: 600;
                    text-align: center;
                    line-height: 1.5;
                    position: relative;
                    z-index: 1;
                    padding: 0 20px;
                }

                .placeholder-sub {
                    font-size: 11px;
                    color: var(--text-muted);
                    position: relative;
                    z-index: 1;
                    font-weight: 400;
                }

                /* ── FREEBIES ── */
                .freebies {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    padding: 20px 24px;
                    background: var(--white);
                    border-bottom: 1px solid var(--border);
                }

                .freebie {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: var(--cream2);
                    border: 1px solid var(--border);
                    border-radius: 12px;
                    padding: 12px;
                }

                .freebie-ico {
                    font-size: 22px;
                    flex-shrink: 0;
                }

                .freebie-text {
                    font-size: 12px;
                    color: var(--text-soft);
                    line-height: 1.4;
                }

                .freebie-text strong {
                    display: block;
                    color: var(--rose-dark);
                    font-size: 12px;
                    margin-bottom: 1px;
                }

                /* ── HOOK 2 ── */
                .hook2 {
                    background: var(--cream);
                    padding: 36px 24px;
                    border-bottom: 1px solid var(--border);
                    text-align: center;
                }

                .hook2-slogan {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(18px, 5vw, 24px);
                    font-weight: 700;
                    line-height: 1.4;
                    color: var(--text);
                    margin-bottom: 16px;
                }

                .hook2-slogan em {
                    font-style: italic;
                    color: var(--rose);
                }

                .hook2-body {
                    font-size: 14px;
                    color: var(--text-soft);
                    line-height: 1.8;
                    margin-bottom: 16px;
                    text-align: left;
                }

                .hook2-body strong {
                    color: var(--text);
                    font-weight: 700;
                }

                .hook2-cta {
                    font-size: 15px;
                    font-weight: 700;
                    color: var(--rose-dark);
                    margin-bottom: 4px;
                }

                .hook2-cta strong {
                    font-size: 17px;
                    color: var(--rose);
                    text-decoration: underline;
                    text-decoration-color: var(--rose-light);
                    text-underline-offset: 3px;
                }

                /* ── FITUR ── */
                .features {
                    background: var(--white);
                    padding: 36px 24px;
                    border-bottom: 1px solid var(--border);
                }

                .feat-label {
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 2.5px;
                    text-transform: uppercase;
                    color: var(--rose);
                    margin-bottom: 16px;
                    display: block;
                }

                .feat-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                }

                .feat-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 0;
                    border-bottom: 1px solid #F5EDE6;
                }

                .feat-item:last-child {
                    border-bottom: none;
                }

                .feat-check {
                    width: 22px;
                    height: 22px;
                    background: var(--green);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    font-size: 11px;
                    font-weight: 800;
                    flex-shrink: 0;
                }

                .feat-text {
                    font-size: 14px;
                    color: var(--text);
                    font-weight: 500;
                    line-height: 1.4;
                }

                .feat-text span {
                    display: block;
                    font-size: 12px;
                    color: var(--text-muted);
                    font-weight: 400;
                    margin-top: 1px;
                }

                /* ── HARGA ── */
                .pricing {
                    background: var(--cream);
                    padding: 36px 24px;
                    border-bottom: 1px solid var(--border);
                    text-align: center;
                }

                .pricing-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 28px;
                    font-weight: 700;
                    color: var(--text);
                    margin-bottom: 20px;
                }

                .price-old {
                    text-decoration: line-through;
                    color: var(--text-muted);
                    font-size: 18px;
                    margin-bottom: 4px;
                }

                .price-now {
                    font-family: 'Playfair Display', serif;
                    font-size: 64px;
                    font-weight: 900;
                    color: var(--rose-dark);
                    line-height: 1;
                    margin-bottom: 8px;
                }

                .price-now sup {
                    font-size: 24px;
                    vertical-align: super;
                }

                .price-note {
                    font-size: 13px;
                    color: var(--text-muted);
                    margin-bottom: 20px;
                }

                .slot-warn {
                    background: #FFF0EE;
                    border: 1px solid #F0B8A8;
                    border-radius: 10px;
                    padding: 12px 16px;
                    font-size: 14px;
                    color: #C03020;
                    font-weight: 600;
                    margin-bottom: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                }

                .slot-warn strong {
                    font-size: 17px;
                    font-weight: 800;
                }

                /* ── BONUS ── */
                .bonus {
                    background: var(--white);
                    padding: 36px 24px;
                    border-bottom: 1px solid var(--border);
                    text-align: center;
                }

                .bonus-headline {
                    font-size: 20px;
                    font-weight: 700;
                    color: var(--text);
                    margin-bottom: 4px;
                }

                .bonus-headline span {
                    color: var(--rose);
                }

                .bonus-sub {
                    font-size: 13px;
                    color: var(--text-muted);
                    margin-bottom: 20px;
                }

                .bonus-items {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    text-align: left;
                }

                .bonus-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    background: var(--cream2);
                    border: 1px solid var(--border);
                    border-radius: 12px;
                    padding: 14px;
                }

                .bonus-ico {
                    font-size: 26px;
                    flex-shrink: 0;
                }

                .bonus-copy h4 {
                    font-size: 14px;
                    font-weight: 700;
                    color: var(--text);
                    margin-bottom: 3px;
                }

                .bonus-copy p {
                    font-size: 12px;
                    color: var(--text-soft);
                    line-height: 1.5;
                }

                /* ── CLOSING + CTA ── */
                .closing {
                    background: var(--cream);
                    padding: 36px 24px 52px;
                    text-align: center;
                }

                .closing-slogan {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(18px, 5vw, 24px);
                    font-weight: 700;
                    line-height: 1.4;
                    color: var(--text);
                    margin-bottom: 6px;
                }

                .closing-slogan em {
                    font-style: italic;
                    color: var(--rose);
                }

                .closing-sub {
                    font-size: 13px;
                    color: var(--text-soft);
                    margin-bottom: 24px;
                    line-height: 1.6;
                }

                .cta-btn {
                    display: block;
                    width: 100%;
                    padding: 18px;
                    background: linear-gradient(135deg, var(--rose-dark), var(--rose), var(--rose-light));
                    color: #fff;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 16px;
                    font-weight: 700;
                    text-align: center;
                    border: none;
                    border-radius: 14px;
                    cursor: pointer;
                    text-decoration: none;
                    box-shadow: 0 6px 28px rgba(139, 80, 69, 0.28);
                    transition: all 0.2s;
                    margin-bottom: 12px;
                    letter-spacing: 0.3px;
                }

                .cta-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 36px rgba(139, 80, 69, 0.38);
                }

                .safe {
                    font-size: 12px;
                    color: var(--text-muted);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                }

                /* ── FOOTER ── */
                .footer {
                    background: var(--white);
                    border-top: 1px solid var(--border);
                    padding: 14px;
                    text-align: center;
                    font-size: 12px;
                    color: var(--text-muted);
                }

                /* ── ANIMATIONS ── */
                @keyframes fadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(16px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .hook1 {
                    animation: fadeUp 0.5s ease 0.05s both;
                }

                .product-section {
                    animation: fadeUp 0.5s ease 0.15s both;
                }

                .freebies {
                    animation: fadeUp 0.5s ease 0.22s both;
                }

                .hook2 {
                    animation: fadeUp 0.5s ease 0.28s both;
                }
                `}
            </style>

            <div className="nikah-rapi-landing-container">
                {/* ── HOOK 1 ── */}
                <div className="hook1">
                    <div className="hook1-quote">
                        "Dari <em>Ribet &amp; Berantakan</em> —<br />
                        Jadi Tinggal Klik,<br />
                        Semua <span className="green">Langsung Rapi.</span>"
                    </div>
                    <div className="hook1-dash"></div>
                </div>

                {/* ── FOTO PRODUK ── */}
                <div className="product-section">

                    <img
                        src="/landing-assets/gambaran-produk-hp-480.webp"
                        alt="Gambaran Produk Nikah Rapi di HP"
                        width="480"
                        height="303"
                        fetchPriority="high"
                        loading="eager"
                        decoding="sync"
                        style={{ width: '100%', height: 'auto', borderRadius: '16px', display: 'block' }}
                    />

                    {/* FREEBIES */}
                    <div className="freebies" style={{ padding: '16px 0 0', border: 'none' }}>
                        <div className="freebie">
                            <div className="freebie-ico">📋</div>
                            <div className="freebie-text"><strong>Free Checklist</strong>Persiapan Pernikahan H-12 Bulan</div>
                        </div>
                        <div className="freebie">
                            <div className="freebie-ico">🎬</div>
                            <div className="freebie-text"><strong>Free Tutorial</strong>Video Panduan Penggunaan Lengkap</div>
                        </div>
                        <div style={{ flexBasis: '100%', display: 'flex', justifyContent: 'center' }}>
                            <div className="freebie" style={{ flex: '0 0 calc(50% - 5px)' }}>
                                <div className="freebie-ico">💬</div>
                                <div className="freebie-text"><strong>CS Available</strong>Siap Bantu Kapanpun Kamu Butuh</div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* ── HOOK 2 ── */}
                <div className="hook2">
                    <div className="hook2-slogan">
                        "Persiapan Nikah Itu Harusnya<br /><em>Menyenangkan, Bukan Menyiksa!</em>"
                    </div>
                    <div className="hook2-body">
                        Masih kelola ratusan tamu di WA, budget di Excel yang berantakan, dan vendor yang susah dihubungi — semua di
                        tempat yang berbeda-beda?<br /><br />
                        <strong>MAU SAMPAI KAPAN?</strong> Saatnya kamu punya satu platform yang urus semuanya — rapi, terstruktur,
                        dan tinggal klik.
                    </div>
                    <div className="hook2-cta">Gunakan <strong>Nikah Rapi</strong> sekarang — tools wajib untuk semua calon pengantin!
                        💍</div>
                </div>

                {/* ── FITUR ── */}
                <div className="features">
                    <span className="feat-label">Fitur Unggulan</span>
                    <div className="feat-list">
                        <div className="feat-item">
                            <div className="feat-check">✓</div>
                            <div className="feat-text">Budget tracker otomatis — pantau setiap rupiah<span>Catat pengeluaran, lihat sisa budget real-time</span></div>
                        </div>
                        <div className="feat-item">
                            <div className="feat-check">✓</div>
                            <div className="feat-text">Kelola tamu &amp; konfirmasi kehadiran digital<span>Import ratusan nama, atur meja duduk dengan mudah</span></div>
                        </div>
                        <div className="feat-item">
                            <div className="feat-check">✓</div>
                            <div className="feat-text">Database vendor terpusat dalam satu tempat<span>Kontak, harga, status negosiasi — ga perlu scroll WA</span></div>
                        </div>
                        <div className="feat-item">
                            <div className="feat-check">✓</div>
                            <div className="feat-text">Tracker seserahan & kado angpao terintegrasi<span>Catat semua item hantaran dan angpao tamu dalam satu tempat</span></div>
                        </div>
                        <div className="feat-item">
                            <div className="feat-check">✓</div>
                            <div className="feat-text">Checklist &amp; timeline dari H-12 bulan sampai hari H<span>Ga ada yang kelewat, semua terpantau</span></div>
                        </div>
                        <div className="feat-item">
                            <div className="feat-check">✓</div>
                            <div className="feat-text">22 modul lengkap — seserahan hingga rundown acara<span>Semua aspek pernikahan sudah ada modulnya</span></div>
                        </div>
                    </div>
                </div>

                {/* ── HARGA ── */}
                <div className="pricing">
                    <div className="pricing-title">Harga:</div>
                    <div className="price-old">Rp 299.000</div>
                    <div className="price-now"><sup>Rp</sup>99.000</div>
                    <div style={{ display: 'inline-block', background: '#D4756B', color: '#fff', fontSize: '12px', fontWeight: '800', padding: '4px 12px', borderRadius: '20px', marginTop: '6px', letterSpacing: '0.05em' }}>🔥 HEMAT 67%</div>
                    <div className="price-note">Akses seumur hidup · Update gratis · Mulai hari ini</div>

                </div>

                {/* ── BONUS ── */}
                <div className="bonus">
                    <div className="bonus-headline">🎁 Dapatkan <span>GRATIS!</span> 🎁</div>
                    <div className="bonus-sub">Bonus eksklusif khusus pembelian sekarang</div>
                    <div className="bonus-items">
                        <div className="bonus-item">
                            <div className="bonus-ico">📋</div>
                            <div className="bonus-copy">
                                <h4>Checklist Persiapan Pernikahan PDF</h4>
                                <p>Panduan lengkap dari H-12 bulan sampai hari H — ga ada yang terlewat.</p>
                            </div>
                        </div>
                        <div className="bonus-item">
                            <div className="bonus-ico">💻</div>
                            <div className="bonus-copy">
                                <h4>Tutorial Lengkap di Dalam Website</h4>
                                <p>Panduan step-by-step semua fitur tersedia langsung di dalam aplikasi. Langsung bisa dipakai dalam 10 menit.</p>
                            </div>
                        </div>
                        <div className="bonus-item">
                            <div className="bonus-ico">💬</div>
                            <div className="bonus-copy">
                                <h4>Customer Service Siap Membantu</h4>
                                <p>Ada kendala atau pertanyaan? Tim CS kami siap bantu via WhatsApp kapanpun kamu butuh.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── CLOSING + CTA ── */}
                <div className="closing">
                    <div className="closing-slogan">
                        Mulailah Jadi Calon Pengantin<br />yang <em>Tenang &amp; Terorganisir.</em>
                    </div>
                    <div className="closing-sub">
                        👇 Klik tombol di bawah dan dapatkan akses sekarang
                    </div>
                    <a href="https://checkout.nikahrapi.online/" className="cta-btn" onClick={() => window.fbq && window.fbq('track', 'InitiateCheckout')}>
                        💍 Dapatkan Nikah Rapi + Bonus Sekarang
                    </a>
                    <div className="safe">🛡️ Pembayaran aman via Scalev · Akses langsung setelah bayar</div>
                </div>

                <div className="footer">Powered by 🔵 <strong>Scalev</strong> · © 2025 Nikah Rapi</div>
            </div>
        </>
    );
}
