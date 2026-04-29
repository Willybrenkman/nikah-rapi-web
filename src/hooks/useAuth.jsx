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
    const { data } = await supabase
      .from('access_codes')
      .select('id')
      .eq('used_by', userId)
      .limit(1)

    setHasAccess(data && data.length > 0)
    setLoading(false)
  }

  useEffect(() => {
    let mounted = true;

    // Listen perubahan auth (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      const currentUser = session?.user ?? null
      setUser(currentUser)
      
      if (currentUser) {
        setLoading(true)
        checkAccess(currentUser.id)
      } else {
        setHasAccess(false)
        setLoading(false)
      }
    })

    return () => {
      mounted = false;
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
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
