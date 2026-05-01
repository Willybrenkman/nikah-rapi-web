// src/hooks/useWedding.js
import { useState, useEffect, useCallback, useRef, createContext, useContext } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

const WeddingContext = createContext(null)

export function WeddingProvider({ children }) {
  // ✅ FIX: Ambil user dari auth context, bukan dari getUser() network call
  const { user, loading: authLoading } = useAuth()
  
  const [wedding, setWedding] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hMin, setHMin] = useState(null)
  
  // ✅ FIX: Cache user ID terakhir yang di-fetch untuk mencegah 
  // re-fetch saat tab switch (user object baru tapi ID sama)
  const lastFetchedUserId = useRef(null)

  const fetchWedding = useCallback(async (userId, force = false) => {
    if (!userId) {
      setWedding(null)
      setHMin(null)
      setLoading(false)
      lastFetchedUserId.current = null
      return
    }

    // ✅ FIX: Skip fetch jika sudah punya data untuk user yang sama
    // Ini mencegah loading spinner muncul saat pindah tab
    if (!force && lastFetchedUserId.current === userId) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      // ✅ FIX: Tidak lagi memanggil supabase.auth.getUser() (network call!)
      // User sudah didapat dari auth context (di-cache di memory)
      const { data, error } = await supabase
        .from('wedding_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error || !data) {
        // User ada tapi belum punya profile → arahkan ke onboarding
        setWedding(null)
        setHMin(null)
      } else {
        setWedding(data)

        if (data.tanggal_pernikahan) {
          const diff = Math.ceil((new Date(data.tanggal_pernikahan) - new Date()) / 86_400_000)
          setHMin(Math.max(0, diff))
        } else {
          setHMin(null)
        }
      }

      lastFetchedUserId.current = userId
    } catch (err) {
      console.error('useWedding error:', err)
      setWedding(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // ✅ FIX: React ke auth context changes, bukan buat listener onAuthStateChange sendiri
  // Ini menghapus listener duplikat yang menyebabkan double API calls → 429
  useEffect(() => {
    // Tunggu auth selesai loading sebelum fetch wedding
    if (authLoading) return

    if (user?.id) {
      fetchWedding(user.id)
    } else {
      setWedding(null)
      setHMin(null)
      setLoading(false)
      lastFetchedUserId.current = null
    }
  }, [user?.id, authLoading, fetchWedding])

  // Fungsi refetch yang bisa dipanggil manual (dari OnBoarding, Pengaturan, dll)
  const refetch = useCallback(() => {
    if (user?.id) {
      lastFetchedUserId.current = null // Reset cache agar force fetch
      return fetchWedding(user.id, true)
    }
  }, [user?.id, fetchWedding])

  return (
    <WeddingContext.Provider value={{ wedding, loading, hMin, refetch }}>
      {children}
    </WeddingContext.Provider>
  )
}

export function useWedding() {
  const ctx = useContext(WeddingContext)
  if (!ctx) throw new Error('useWedding harus dipakai di dalam <WeddingProvider>')
  return ctx
}