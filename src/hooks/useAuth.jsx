import React, { createContext, useContext, useEffect, useState, useRef, useMemo } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()
const ACCESS_CACHE_KEY = 'nr_access'

export function AuthProvider({ children }) {
  // ✅ Baca cached access untuk instant rendering saat refresh
  const cachedAccess = useMemo(() => {
    try { return localStorage.getItem(ACCESS_CACHE_KEY) === '1' }
    catch { return false }
  }, [])

  const [user, setUser] = useState(undefined) // undefined = belum dicek, null = tidak ada
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
      // On error, keep cached value (don't break UX)
    }
  }

  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!mounted) return

        if (session?.user) {
          setUser(session.user)

          if (cachedAccess) {
            // ✅ FAST PATH: Cached access → stop loading instantly
            // Verify di background tanpa blocking UI
            setLoading(false)
            initializedRef.current = true
            checkAccess(session.user.id) // fire-and-forget
          } else {
            // SLOW PATH: No cache → harus verify dulu
            await checkAccess(session.user.id)
            if (mounted) {
              setLoading(false)
              initializedRef.current = true
            }
          }
        } else {
          setUser(null)
          setAccessWithCache(false)
          setLoading(false)
          initializedRef.current = true
        }
      } catch (err) {
        console.error('initAuth error:', err)
        if (mounted) {
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
              checkAccess(session.user.id) // background
            } else {
              await checkAccess(session.user.id)
              setLoading(false)
              initializedRef.current = true
            }
          }
        } else if (event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            setUser(session.user)
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setAccessWithCache(false)
          setLoading(false)
          initializedRef.current = false
          try { localStorage.removeItem(ACCESS_CACHE_KEY) } catch {}
        }
      }
    )

    return () => {
      mounted = false
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
