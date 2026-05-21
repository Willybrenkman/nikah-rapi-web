import React, { createContext, useContext, useEffect, useState, useRef, useMemo } from 'react'

const AuthContext = createContext()
const USER_CACHE_KEY = 'nr_user'

export function AuthProvider({ children }) {
  // ✅ CACHE-FIRST: Baca cached user dari localStorage
  const cached = useMemo(() => {
    try {
      const userRaw = localStorage.getItem(USER_CACHE_KEY)
      const user = userRaw ? JSON.parse(userRaw) : null
      return { user }
    } catch { return { user: null } }
  }, [])

  const [user, setUser] = useState(cached.user)
  const [loading, setLoading] = useState(!cached.user)
  const initializedRef = useRef(!!cached.user)

  // ── Helper: simpan user ke cache ──
  const setUserWithCache = (userData) => {
    setUser(userData)
    try {
      if (userData) {
        localStorage.setItem(USER_CACHE_KEY, JSON.stringify({
          id: userData.id,
          email: userData.email,
          user_metadata: userData.user_metadata || {}
        }))
      } else {
        localStorage.removeItem(USER_CACHE_KEY)
      }
    } catch {}
  }

  useEffect(() => {
    let mounted = true
    let unsubscribe = null

    const initAuth = async () => {
      try {
        // PERF: Don't load Supabase eagerly on landing pages if not logged in
        const isLandingPage = ['/', '/untuk-ibu', '/untuk-pria', '/untuk-karir', '/v4', '/global', '/demo'].includes(window.location.pathname)
        if (isLandingPage && !cached.user) {
          if (mounted && !initializedRef.current) {
            setLoading(false)
            initializedRef.current = true
          }
          return
        }

        const { supabase } = await import('../lib/supabase')
        const { data: { session } } = await supabase.auth.getSession()
        if (!mounted) return

        if (session?.user) {
          setUserWithCache(session.user)
          if (!initializedRef.current) {
            setLoading(false)
            initializedRef.current = true
          }
        } else {
          // No valid session — always clear cache, even if cached user exists
          setUserWithCache(null)
          if (mounted) {
            setLoading(false)
            initializedRef.current = true
          }
        }

        // ── Auth state change listener ──
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (!mounted) return

            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
              if (session?.user) {
                setUserWithCache(session.user)
                if (!initializedRef.current) {
                  setLoading(false)
                  initializedRef.current = true
                }
              }
            } else if (event === 'SIGNED_OUT') {
              if (initializedRef.current) {
                setUserWithCache(null)
                setLoading(false)
                initializedRef.current = false
              }
            }
          }
        )
        unsubscribe = () => subscription.unsubscribe()

      } catch (err) {
        console.error('initAuth error:', err)
        if (!cached.user && mounted) {
          setUserWithCache(null)
          setLoading(false)
          initializedRef.current = true
        }
      }
    }

    initAuth()

    return () => {
      mounted = false
      if (unsubscribe) unsubscribe()
    }
  }, [])

  // ── Sign out ──
  const signOut = async () => {
    const { supabase } = await import('../lib/supabase')
    await supabase.auth.signOut()
    localStorage.removeItem('nr_wedding')
    setUserWithCache(null)
    initializedRef.current = false
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
