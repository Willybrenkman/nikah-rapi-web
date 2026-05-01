import React, { createContext, useContext, useEffect, useState, useRef, useMemo } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()
const ACCESS_CACHE_KEY = 'nr_access'

// ✅ Safety timeout: jangan pernah stuck loading lebih dari 5 detik
const AUTH_TIMEOUT_MS = 5000

export function AuthProvider({ children }) {
  const cachedAccess = useMemo(() => {
    try { return localStorage.getItem(ACCESS_CACHE_KEY) === '1' }
    catch { return false }
  }, [])

  const [user, setUser] = useState(undefined)
  const [hasAccess, setHasAccess] = useState(cachedAccess)
  const [loading, setLoading] = useState(true)
  const initializedRef = useRef(false)

  const setAccessWithCache = (value) => {
    setHasAccess(value)
    try { localStorage.setItem(ACCESS_CACHE_KEY, value ? '1' : '0') } catch {}
  }

  const checkAccess = async (userId) => {
    if (!userId) {
      setAccessWithCache(false)
      return
    }
    try {
      const { data } = await supabase
        .from('access_codes')
        .select('id')
        .eq('used_by', userId)
        .limit(1)
      setAccessWithCache(data && data.length > 0)
    } catch (err) {
      console.error('checkAccess error:', err)
    }
  }

  useEffect(() => {
    let mounted = true

    // ✅ Safety timeout: force stop loading jika initAuth hang
    const timeoutId = setTimeout(() => {
      if (mounted && loading) {
        console.warn('Auth init timeout - forcing loading=false')
        setLoading(false)
        initializedRef.current = true
      }
    }, AUTH_TIMEOUT_MS)

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!mounted) return

        if (session?.user) {
          setUser(session.user)

          if (cachedAccess) {
            // FAST PATH: cached access → instant render
            setLoading(false)
            initializedRef.current = true
            checkAccess(session.user.id) // background verify
          } else {
            // SLOW PATH: verify access first
            await checkAccess(session.user.id)
            if (mounted) {
              setLoading(false)
              initializedRef.current = true
            }
          }
        } else {
          setUser(null)
          setAccessWithCache(false)
          if (mounted) {
            setLoading(false)
            initializedRef.current = true
          }
        }
      } catch (err) {
        console.error('initAuth error:', err)
        if (mounted) {
          setUser(null)
          setLoading(false)
          initializedRef.current = true
        }
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        if (event === 'SIGNED_IN') {
          if (session?.user) {
            setUser(session.user)
            if (initializedRef.current) {
              checkAccess(session.user.id)
            } else {
              await checkAccess(session.user.id)
              if (mounted) {
                setLoading(false)
                initializedRef.current = true
              }
            }
          }
        } else if (event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            setUser(session.user)
          }
        } else if (event === 'INITIAL_SESSION') {
          // ✅ Supabase v2.39+ fires this on mount
          // Sudah di-handle oleh initAuth(), abaikan saja
          if (session?.user) {
            setUser(session.user)
          }
        } else if (event === 'SIGNED_OUT') {
          // ✅ FIX: Hanya handle SIGNED_OUT SETELAH initial auth selesai!
          // Ini mencegah race condition dimana token refresh gagal (slow/429)
          // memicu SIGNED_OUT sebelum initAuth() selesai → user ke-kick
          if (initializedRef.current) {
            setUser(null)
            setAccessWithCache(false)
            setLoading(false)
            initializedRef.current = false
            try { localStorage.removeItem(ACCESS_CACHE_KEY) } catch {}
          }
        }
      }
    )

    return () => {
      mounted = false
      clearTimeout(timeoutId)
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setAccessWithCache(false)
    initializedRef.current = false
    try { localStorage.removeItem(ACCESS_CACHE_KEY) } catch {}
  }

  const refreshAccess = async () => {
    if (user) {
      setLoading(true)
      await checkAccess(user.id)
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, hasAccess, loading, signOut, refreshAccess }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
