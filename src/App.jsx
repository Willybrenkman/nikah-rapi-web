import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './hooks/useAuth'
import { supabase } from './lib/supabase'
import Layout from './components/layout/Layout'
import WhatsAppButton from './components/WhatsAppButton'

// Auth pages
import Login from './pages/Login'
// Register is merged into Login via Magic Links
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import AuthCallback from './pages/Authcallback'
import OnBoarding from './pages/OnBoarding'
import ClaimCode from './pages/ClaimCode'

// App pages
import Dashboard from './pages/Dashboard'
import BudgetPlanner from './pages/BudgetPlanner'
import SeserahanTracker from './pages/SeserahanTracker'
import KadoAngpao from './pages/KadoAngpao'
import GuestList from './pages/GuestList'
import RSVPTracker from './pages/RSVPTracker'
import VendorManager from './pages/VendorManager'
import TimelineAcara from './pages/TimelineAcara'
import Checklist from './pages/Checklist'
import Dekorasi from './pages/Dekorasi'
import Katering from './pages/Katering'
import Undangan from './pages/Undangan'
import MUABusana from './pages/MUABusana'
import FotoVideo from './pages/FotoVideo'
import CincinMahar from './pages/CincinMahar'
import Honeymoon from './pages/Honeymoon'
import Souvenir from './pages/Souvenir'
import CatatanPenting from './pages/CatatanPenting'
import RekapAkhir from './pages/RekapAkhir'
import Panduan from './pages/Panduan'
import Pengaturan from './pages/Pengaturan'
import Profil from './pages/Profil'
import ActivityLogs from './pages/ActivityLogs'

function Guard({ children }) {
  const { user, hasAccess, loading } = useAuth()
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FDFAF6' }}>
      <div style={{ fontSize: 48, animation: 'pulse-logo 1.5s ease-in-out infinite' }}>💍</div>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (!hasAccess) return <Navigate to="/claim-code" replace />
  return children
}

function CodeGuard({ children }) {
  const { user, hasAccess, loading } = useAuth()
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FDFAF6' }}>
      <div style={{ fontSize: 48, animation: 'pulse-logo 1.5s ease-in-out infinite' }}>💍</div>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (hasAccess) return <Navigate to="/" replace />
  return children
}


export default function App() {
  // Inactivity Timer Logic
  useEffect(() => {
    let timeoutId;
    const TIMEOUT_IN_MS = 30 * 60 * 1000; // 30 minutes

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          await supabase.auth.signOut();
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
      <Routes>
        {/* ── Public ── */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* ── Claim Code (requires login but NO access yet) ── */}
        <Route path="/claim-code" element={<CodeGuard><ClaimCode /></CodeGuard>} />

        {/* ── Onboarding (protected) ── */}
        <Route path="/onboarding" element={<Guard><OnBoarding /></Guard>} />

        {/* ── Protected app ── */}
        <Route path="/" element={<Guard><Layout /></Guard>}>
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
    </BrowserRouter>
  )
}