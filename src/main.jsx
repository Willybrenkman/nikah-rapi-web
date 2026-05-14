import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'
import { WeddingProvider } from './hooks/useWedding'
import { AuthProvider } from './hooks/useAuth'
import { registerSW } from 'virtual:pwa-register'

// ── Sentry error tracking ──
// Pasang VITE_SENTRY_DSN di Vercel environment variables untuk mengaktifkan
if (import.meta.env.VITE_SENTRY_DSN) {
  import('@sentry/react').then(Sentry => {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
      tracesSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    })
  })
}

// Reload otomatis saat lazy chunk gagal dimuat (deploy baru)
window.addEventListener('vite:preloadError', () => window.location.reload())

// Mendaftarkan Service Worker untuk fitur Offline & PWA
registerSW({ immediate: true })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <WeddingProvider>
          <App />
        </WeddingProvider>
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>
)