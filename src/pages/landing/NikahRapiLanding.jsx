import React, { useEffect } from 'react';
import './NikahRapiLanding.css';

export default function NikahRapiLanding() {
    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap';
        document.head.appendChild(link);
        return () => { if (document.head.contains(link)) document.head.removeChild(link); };
    }, []);

    return (
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
                    src="/landing-assets/gambaran-produk-hp.webp"
                    alt="Gambaran Produk Nikah Rapi di HP"
                    width="800"
                    height="505"
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
    );
}
