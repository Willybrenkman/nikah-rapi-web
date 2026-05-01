import React, { createContext, useContext, useEffect, useState, useRef, useMemo } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()
const ACCESS_CACHE_KEY = 'nr_access'
const USER_CACHE_KEY = 'nr_user'

export function AuthProvider({ children }) {
  // ✅ CACHE-FIRST: Baca cached user + access dari localStorage
  // Ini membuat reload INSTAN — tidak perlu tunggu Supabase verify
  const cached = useMemo(() => {
    try {
      const access = localStorage.getItem(ACCESS_CACHE_KEY) === '1'
      const userRaw = localStorage.getItem(USER_CACHE_KEY)
      const user = userRaw ? JSON.parse(userRaw) : null
      return { access, user }
    } catch { return { access: false, user: null } }
  }, [])

  // Jika ada cache, langsung pakai → TIDAK loading, TIDAK ke-kick
  const [user, setUser] = useState(cached.user)
  const [hasAccess, setHasAccess] = useState(cached.access)
  const [loading, setLoading] = useState(!cached.user) // false jika ada cache!
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

  // ── Helper: simpan access ke cache ──
  const setAccessWithCache = (value) => {
    setHasAccess(value)
    try { localStorage.setItem(ACCESS_CACHE_KEY, value ? '1' : '0') } catch {}
  }

  // ── Check access code ──
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
      // On error, keep cached value — jangan kick user
    }
  }

  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!mounted) return

        if (session?.user) {
          // ✅ Session valid — update cache dengan data terbaru
          setUserWithCache(session.user)

          if (cached.access) {
            // FAST PATH: sudah ada cache → verify di background
            if (!initializedRef.current) {
              setLoading(false)
              initializedRef.current = true
            }
            checkAccess(session.user.id) // background
          } else {
            // SLOW PATH: belum ada cache → verify dulu
            await checkAccess(session.user.id)
            if (mounted) {
              setLoading(false)
              initializedRef.current = true
            }
          }
        } else {
          // ❌ Tidak ada session — HANYA kick jika juga tidak ada cache
          if (!cached.user) {
            setUserWithCache(null)
            setAccessWithCache(false)
            if (mounted) {
              setLoading(false)
              initializedRef.current = true
            }
          }
          // Jika ada cache tapi getSession() gagal (429/slow):
          // JANGAN kick user — biarkan pakai cache
          // Supabase akan auto-refresh token di background
        }
      } catch (err) {
        console.error('initAuth error:', err)
        // On error: jika ada cache, keep user logged in
        if (!cached.user && mounted) {
          setUserWithCache(null)
          setLoading(false)
          initializedRef.current = true
        }
      }
    }

    initAuth()

    // ── Auth state change listener ──
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        if (event === 'SIGNED_IN') {
          if (session?.user) {
            setUserWithCache(session.user)
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
          // Token di-refresh berhasil — update user
          if (session?.user) {
            setUserWithCache(session.user)
          }
        } else if (event === 'INITIAL_SESSION') {
          if (session?.user) {
            setUserWithCache(session.user)
          }
        } else if (event === 'SIGNED_OUT') {
          // ✅ Hanya handle jika sudah initialized (user-initiated signout)
          // Ignore premature SIGNED_OUT saat reload (token refresh lambat)
          if (initializedRef.current) {
            setUserWithCache(null)
            setAccessWithCache(false)
            setLoading(false)
            initializedRef.current = false
          }
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // ── Explicit sign out (dari tombol logout / inactivity timer) ──
  const signOut = async () => {
    await supabase.auth.signOut()
    setUserWithCache(null)
    setAccessWithCache(false)
    initializedRef.current = false
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
