import { useState, useEffect, Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './hooks/useAuth'
import Layout from './components/layout/Layout'
import WhatsAppButton from './components/WhatsAppButton'
import ErrorBoundary from './components/ErrorBoundary'

// Lazy load pages for code splitting
const Login = lazy(() => import('./pages/Login'))
const OnBoarding = lazy(() => import('./pages/OnBoarding'))

const Dashboard = lazy(() => import('./pages/Dashboard'))
const BudgetPlanner = lazy(() => import('./pages/BudgetPlanner'))
const SeserahanTracker = lazy(() => import('./pages/SeserahanTracker'))
const KadoAngpao = lazy(() => import('./pages/KadoAngpao'))
const GuestList = lazy(() => import('./pages/GuestList'))
const RSVPTracker = lazy(() => import('./pages/RSVPTracker'))
const VendorManager = lazy(() => import('./pages/VendorManager'))
const TimelineAcara = lazy(() => import('./pages/TimelineAcara'))
const Checklist = lazy(() => import('./pages/Checklist'))
const Dekorasi = lazy(() => import('./pages/Dekorasi'))
const Katering = lazy(() => import('./pages/Katering'))
const Undangan = lazy(() => import('./pages/Undangan'))
const MUABusana = lazy(() => import('./pages/MUABusana'))

const LandingMain = lazy(() => import('./pages/landing/LandingMain'))
const LandingIbu = lazy(() => import('./pages/landing/LandingIbu'))
const LandingPria = lazy(() => import('./pages/landing/LandingPria'))
const LandingKarir = lazy(() => import('./pages/landing/LandingKarir'))
const NikahRapiLanding = lazy(() => import('./pages/landing/NikahRapiLanding'))
const Demo = lazy(() => import('./pages/Demo'))
const FotoVideo = lazy(() => import('./pages/FotoVideo'))
const CincinMahar = lazy(() => import('./pages/CincinMahar'))
const Honeymoon = lazy(() => import('./pages/Honeymoon'))
const Souvenir = lazy(() => import('./pages/Souvenir'))
const CatatanPenting = lazy(() => import('./pages/CatatanPenting'))
const RekapAkhir = lazy(() => import('./pages/RekapAkhir'))
const Panduan = lazy(() => import('./pages/Panduan'))
const Pengaturan = lazy(() => import('./pages/Pengaturan'))
const Profil = lazy(() => import('./pages/Profil'))
const ActivityLogs = lazy(() => import('./pages/ActivityLogs'))

function Guard({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FDFAF6' }}>
      <div style={{ fontSize: 48, animation: 'pulse-logo 1.5s ease-in-out infinite' }}>💍</div>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  return children
}

const Loader = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FDFAF6' }}>
    <div style={{ fontSize: 48, animation: 'pulse-logo 1.5s ease-in-out infinite' }}>💍</div>
  </div>
)

export default function App() {
  // Inactivity Timer Logic
  useEffect(() => {
    let timeoutId;
    const TIMEOUT_IN_MS = 30 * 60 * 1000; // 30 minutes

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        const { supabase } = await import('./lib/supabase');
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          await supabase.auth.signOut();
          localStorage.removeItem('nr_user');
          localStorage.removeItem('nr_wedding');
          window.location.href = '/login?reason=timeout';
        }
      }, TIMEOUT_IN_MS);
    };

    // Events to track
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => document.addEventListener(event, resetTimer));

    resetTimer(); // Start timer on mount

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => document.removeEventListener(event, resetTimer));
    };
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: "'DM Sans',sans-serif", fontSize: 14 } }} />
      <WhatsAppButton />
      <ErrorBoundary>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* ── Public ── */}
          <Route path="/" element={<LandingMain />} />
          <Route path="/untuk-ibu" element={<LandingIbu />} />
          <Route path="/untuk-pria" element={<LandingPria />} />
          <Route path="/untuk-karir" element={<LandingKarir />} />
          <Route path="/v4" element={<NikahRapiLanding />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/login" element={<Login />} />

          {/* ── Onboarding (protected) ── */}
          <Route path="/onboarding" element={<Guard><OnBoarding /></Guard>} />

          {/* ── Protected app ── */}
          <Route path="/dashboard" element={<Guard><Layout /></Guard>}>
            <Route index element={<Dashboard />} />
            <Route path="budget" element={<BudgetPlanner />} />
            <Route path="seserahan" element={<SeserahanTracker />} />
            <Route path="kado-angpao" element={<KadoAngpao />} />
            <Route path="guest-list" element={<GuestList />} />
            <Route path="rsvp" element={<RSVPTracker />} />
            <Route path="vendor" element={<VendorManager />} />
            <Route path="timeline" element={<TimelineAcara />} />
            <Route path="checklist" element={<Checklist />} />
            <Route path="dekorasi" element={<Dekorasi />} />
            <Route path="katering" element={<Katering />} />
            <Route path="undangan" element={<Undangan />} />
            <Route path="mua-busana" element={<MUABusana />} />
            <Route path="foto-video" element={<FotoVideo />} />
            <Route path="cincin-mahar" element={<CincinMahar />} />
            <Route path="honeymoon" element={<Honeymoon />} />
            <Route path="souvenir" element={<Souvenir />} />
            <Route path="catatan" element={<CatatanPenting />} />
            <Route path="rekap" element={<RekapAkhir />} />
            <Route path="activity" element={<ActivityLogs />} />
            <Route path="panduan" element={<Panduan />} />
            <Route path="pengaturan" element={<Pengaturan />} />
            <Route path="profil" element={<Profil />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  )
}