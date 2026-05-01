// src/hooks/useWedding.js
import { useState, useEffect, useCallback, useRef, createContext, useContext } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

const WeddingContext = createContext(null)
const WEDDING_CACHE_KEY = 'nr_wedding'

// Helper: baca cache dari localStorage
function readCache() {
  try {
    const raw = localStorage.getItem(WEDDING_CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

// Helper: tulis cache ke localStorage
function writeCache(data) {
  try {
    if (data) {
      localStorage.setItem(WEDDING_CACHE_KEY, JSON.stringify(data))
    } else {
      localStorage.removeItem(WEDDING_CACHE_KEY)
    }
  } catch {}
}

// Helper: hitung hari menuju pernikahan
function calcHMin(tanggal) {
  if (!tanggal) return null
  const diff = Math.ceil((new Date(tanggal) - new Date()) / 86_400_000)
  return Math.max(0, diff)
}

export function WeddingProvider({ children }) {
  const { user } = useAuth()

  // ✅ Baca cached wedding data untuk instant rendering saat refresh
  const cachedRef = useRef(readCache())

  const [wedding, setWedding] = useState(cachedRef.current)
  const [loading, setLoading] = useState(!cachedRef.current) // false jika ada cache!
  const [hMin, setHMin] = useState(() => calcHMin(cachedRef.current?.tanggal_pernikahan))
  const lastFetchedUserId = useRef(null)

  const updateWedding = useCallback((data) => {
    setWedding(data)
    setHMin(calcHMin(data?.tanggal_pernikahan))
    writeCache(data)
  }, [])

  const fetchWedding = useCallback(async (userId, force = false) => {
    if (!userId) {
      updateWedding(null)
      setLoading(false)
      lastFetchedUserId.current = null
      return
    }

    // Skip fetch jika sudah punya data untuk user yang sama
    if (!force && lastFetchedUserId.current === userId) {
      setLoading(false)
      return
    }

    // ✅ Jika ada cache, JANGAN tampilkan loading — refresh di background
    if (!cachedRef.current) {
      setLoading(true)
    }

    try {
      const { data, error } = await supabase
        .from('wedding_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error || !data) {
        updateWedding(null)
      } else {
        updateWedding(data)
        cachedRef.current = data
      }
      lastFetchedUserId.current = userId
    } catch (err) {
      console.error('useWedding error:', err)
      // Jika network error tapi ada cache, tetap gunakan cache
      if (!cachedRef.current) {
        updateWedding(null)
      }
    } finally {
      setLoading(false)
    }
  }, [updateWedding])

  // ✅ React ke user changes langsung — TIDAK tunggu authLoading
  // Ini membuat wedding fetch berjalan PARALEL dengan checkAccess
  useEffect(() => {
    if (user === undefined) return // Auth belum dicek, keep cached data

    if (user?.id) {
      fetchWedding(user.id)
    } else {
      // user === null → signed out
      updateWedding(null)
      setLoading(false)
      lastFetchedUserId.current = null
      cachedRef.current = null
    }
  }, [user, fetchWedding, updateWedding])

  const refetch = useCallback(() => {
    if (user?.id) {
      lastFetchedUserId.current = null
      cachedRef.current = null
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