// src/hooks/useWedding.js
import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { supabase } from '../lib/supabase'

const WeddingContext = createContext(null)

export function WeddingProvider({ children }) {
  const [wedding, setWedding] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hMin, setHMin] = useState(null)

  const fetchWedding = useCallback(async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setWedding(null)
        setHMin(null)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('wedding_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error || !data) {
        // User ada tapi belum punya profile → arahkan ke onboarding
        setWedding(null)
        setHMin(null)
        setLoading(false)
        return
      }

      setWedding(data)

      if (data.tanggal_pernikahan) {
        const diff = Math.ceil((new Date(data.tanggal_pernikahan) - new Date()) / 86_400_000)
        setHMin(Math.max(0, diff))
      } else {
        setHMin(null)
      }
    } catch (err) {
      console.error('useWedding error:', err)
      setWedding(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWedding()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') fetchWedding()
      if (event === 'SIGNED_OUT') { setWedding(null); setHMin(null) }
    })
    return () => subscription.unsubscribe()
  }, [fetchWedding])

  return (
    <WeddingContext.Provider value={{ wedding, loading, hMin, refetch: fetchWedding }}>
      {children}
    </WeddingContext.Provider>
  )
}

export function useWedding() {
  const ctx = useContext(WeddingContext)
  if (!ctx) throw new Error('useWedding harus dipakai di dalam <WeddingProvider>')
  return ctx
}