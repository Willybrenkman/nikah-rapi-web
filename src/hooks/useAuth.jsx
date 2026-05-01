import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // ✅ FIX: Track apakah initial auth sudah selesai
  // Setelah initial auth, JANGAN PERNAH set loading=true lagi
  // Ini mencegah loading spinner muncul saat pindah tab
  const initializedRef = useRef(false)

  const checkAccess = async (userId) => {
    if (!userId) {
      setHasAccess(false)
      return
    }
    try {
      const { data } = await supabase
        .from('access_codes')
        .select('id')
        .eq('used_by', userId)
        .limit(1)

      setHasAccess(data && data.length > 0)
    } catch (err) {
      console.error('checkAccess error:', err)
      setHasAccess(false)
    }
  }

  useEffect(() => {
    let mounted = true

    // 1. Cek session yang sudah ada saat mount
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!mounted) return

        if (session?.user) {
          setUser(session.user)
          await checkAccess(session.user.id)
        } else {
          setUser(null)
          setHasAccess(false)
        }
      } catch (err) {
        console.error('initAuth error:', err)
      } finally {
        if (mounted) {
          setLoading(false)
          initializedRef.current = true
        }
      }
    }

    initAuth()

    // 2. Listen perubahan auth (login / logout / token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        if (event === 'SIGNED_IN') {
          if (session?.user) {
            setUser(session.user)

            if (initializedRef.current) {
              // ✅ FIX: Setelah initial auth selesai, re-check access 
              // di background TANPA menampilkan loading spinner.
              // Ini mencegah flash loading saat pindah tab Chrome.
              checkAccess(session.user.id) // fire-and-forget, no await
            } else {
              // Fresh login pertama kali - tunggu checkAccess selesai
              await checkAccess(session.user.id)
              setLoading(false)
              initializedRef.current = true
            }
          }
        } else if (event === 'TOKEN_REFRESHED') {
          // ✅ Token refresh saat ganti tab — hanya update user object,
          // JANGAN trigger loading atau re-check access
          if (session?.user) {
            setUser(session.user)
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setHasAccess(false)
          setLoading(false)
          initializedRef.current = false
        }
        // INITIAL_SESSION event (Supabase v2.39+) sudah di-handle oleh initAuth()
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
    setHasAccess(false)
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
