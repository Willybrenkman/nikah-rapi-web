// src/hooks/useWedding.jsx
import { useState, useEffect, useCallback, useRef, createContext, useContext } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

const WeddingContext = createContext(null)
const WEDDING_CACHE_KEY = 'nr_wedding'
const WEDDING_TIMEOUT_MS = 10000 // Ditambah sedikit untuk stabilitas

function readCache() {
  try {
    const raw = localStorage.getItem(WEDDING_CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function writeCache(data) {
  try {
    if (data) localStorage.setItem(WEDDING_CACHE_KEY, JSON.stringify(data))
    else localStorage.removeItem(WEDDING_CACHE_KEY)
  } catch {}
}

function calcHMin(tanggal) {
  if (!tanggal) return null
  const diff = Math.ceil((new Date(tanggal) - new Date()) / 86_400_000)
  return Math.max(0, diff)
}

export function WeddingProvider({ children }) {
  const { user, loading: authLoading } = useAuth()

  const cachedRef = useRef(readCache())
  const [wedding, setWedding] = useState(cachedRef.current)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null) // State error baru
  const [hMin, setHMin] = useState(() => calcHMin(cachedRef.current?.tanggal_pernikahan))
  const lastFetchedUserId = useRef(null)

  const updateWedding = useCallback((data) => {
    setWedding(data)
    setHMin(calcHMin(data?.tanggal_pernikahan))
    writeCache(data)
    if (data) cachedRef.current = data
  }, [])

  const fetchWedding = useCallback(async (userId, force = false, retryCount = 0) => {
    if (!userId) {
      updateWedding(null)
      setLoading(false)
      setError(null)
      lastFetchedUserId.current = null
      return
    }

    if (!force && lastFetchedUserId.current === userId && !error) {
      setLoading(false)
      return
    }

    // Hanya tampilkan loading jika tidak ada cache sama sekali
    if (!cachedRef.current) {
      setLoading(true)
    }
    setError(null)

    try {
      console.log(`[useWedding] Fetching profile (Attempt ${retryCount + 1})...`)
      const { data, error: fetchError } = await supabase
        .from('wedding_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (fetchError) {
        // PGRST116 = JSON object requested, but no rows returned (Berarti belum onboarding)
        if (fetchError.code === 'PGRST116') {
          console.log('[useWedding] Status: No profile found (Confirmed)')
          updateWedding(null)
          setError(null) // Bukan error sistem, memang datanya tidak ada
        } else {
          // Error lain (Network, RLS, JWT expired, etc)
          console.error('[useWedding] Fetch error:', fetchError.message, fetchError.code)
          
          // Retry logic (max 2x) untuk error selain PGRST116
          if (retryCount < 2) {
            console.log(`[useWedding] Retrying in 1.5s...`)
            await new Promise(r => setTimeout(r, 1500))
            return fetchWedding(userId, true, retryCount + 1)
          }

          setError(fetchError.message)
          // JANGAN set wedding=null jika ini error sistem, agar Layout tidak redirect paksa ke onboarding
        }
      } else {
        console.log('[useWedding] Status: Profile loaded successfully')
        updateWedding(data)
        setError(null)
      }
      lastFetchedUserId.current = userId
    } catch (err) {
      console.error('[useWedding] Unexpected error:', err)
      setError('Terjadi kesalahan tak terduga saat mengambil data.')
    } finally {
      setLoading(false)
    }
  }, [updateWedding, error])

  const userId = user?.id

  // Trigger fetch saat auth siap
  useEffect(() => {
    if (authLoading) return

    if (userId) {
      fetchWedding(userId)
    } else {
      updateWedding(null)
      setLoading(false)
      setError(null)
      lastFetchedUserId.current = null
      cachedRef.current = null
    }
  }, [userId, authLoading, fetchWedding, updateWedding])

  // Safety timeout
  useEffect(() => {
    if (!loading) return
    const t = setTimeout(() => {
      if (loading) {
        console.warn('[useWedding] Fetch timeout reached')
        setLoading(false)
        if (!wedding && !error) {
          setError('Koneksi lambat. Silakan muat ulang halaman.')
        }
      }
    }, WEDDING_TIMEOUT_MS)
    return () => clearTimeout(t)
  }, [loading, wedding, error])

  const refetch = useCallback(() => {
    if (userId) {
      lastFetchedUserId.current = null
      return fetchWedding(userId, true)
    }
  }, [userId, fetchWedding])

  return (
    <WeddingContext.Provider value={{ wedding, loading, error, hMin, refetch }}>
      {children}
    </WeddingContext.Provider>
  )
}

export function useWedding() {
  const ctx = useContext(WeddingContext)
  if (!ctx) throw new Error('useWedding harus dipakai di dalam <WeddingProvider>')
  return ctx
}