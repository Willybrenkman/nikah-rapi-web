import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'
import { WeddingProvider } from './hooks/useWedding'
import { AuthProvider } from './hooks/useAuth'
import { registerSW } from 'virtual:pwa-register'

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