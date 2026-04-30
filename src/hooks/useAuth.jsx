import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(true)

  const checkAccess = async (userId) => {
    if (!userId) {
      setHasAccess(false)
      setLoading(false)
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
    setLoading(false)
  }

  useEffect(() => {
    let mounted = true

    // 1. Cek session yang sudah ada saat mount
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!mounted) return

      if (session?.user) {
        setUser(session.user)
        await checkAccess(session.user.id)
      } else {
        setUser(null)
        setHasAccess(false)
        setLoading(false)
      }
    }

    initAuth()

    // 2. Listen perubahan auth (login / logout / token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            setUser(session.user)
            setLoading(true)
            await checkAccess(session.user.id)
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setHasAccess(false)
          setLoading(false)
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
    setHasAccess(false)
  }

  const refreshAccess = async () => {
    if (user) {
      setLoading(true)
      await checkAccess(user.id)
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
