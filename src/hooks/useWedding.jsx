// src/hooks/useWedding.js
import { useState, useEffect, useCallback, useRef, createContext, useContext } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

const WeddingContext = createContext(null)
const WEDDING_CACHE_KEY = 'nr_wedding'
const WEDDING_TIMEOUT_MS = 8000

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
  const { user } = useAuth()

  const cachedRef = useRef(readCache())
  const [wedding, setWedding] = useState(cachedRef.current)
  const [loading, setLoading] = useState(!cachedRef.current)
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

    if (!force && lastFetchedUserId.current === userId) {
      setLoading(false)
      return
    }

    // Jika ada cache, jangan tampilkan loading
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
      if (!cachedRef.current) {
        updateWedding(null)
      }
    } finally {
      setLoading(false)
    }
  }, [updateWedding])

  // ✅ Gunakan user?.id sebagai dependency (primitive, stabil)
  // bukan user (object reference yang berubah terus)
  const userId = user?.id
  const isUserChecked = user !== undefined

  useEffect(() => {
    if (!isUserChecked) return // Auth belum dicek

    if (userId) {
      fetchWedding(userId)
    } else {
      // user === null → signed out
      updateWedding(null)
      setLoading(false)
      lastFetchedUserId.current = null
      cachedRef.current = null
    }
  }, [userId, isUserChecked, fetchWedding, updateWedding])

  // ✅ Safety timeout: jangan stuck loading forever
  useEffect(() => {
    if (!loading) return
    const t = setTimeout(() => {
      if (loading) {
        console.warn('Wedding fetch timeout - forcing loading=false')
        setLoading(false)
      }
    }, WEDDING_TIMEOUT_MS)
    return () => clearTimeout(t)
  }, [loading])

  const refetch = useCallback(() => {
    if (userId) {
      lastFetchedUserId.current = null
      cachedRef.current = null
      return fetchWedding(userId, true)
    }
  }, [userId, fetchWedding])

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