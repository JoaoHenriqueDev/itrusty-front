import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { supabase } from '../services/supabase'
import { api, setUnauthorizedCallback } from '../services/api'
import { saveSecure, getSecure, deleteSecure } from '../utils/storage'
import { invalidarCacheOficina } from '../hooks/useOficina'
import { resetarNotificacoes } from '../hooks/useNotificacoes'

type User = {
  id: string
  name: string
  role: 'MOTORISTA' | 'OFICINA' | null
}

function isValidUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as any).id   === 'string' &&
    typeof (obj as any).name === 'string' &&
    ((obj as any).role === 'MOTORISTA' || (obj as any).role === 'OFICINA' || (obj as any).role === null)
  )
}

type AuthContextType = {
  token: string | null
  user: User | null
  loading: boolean
  transitioning: boolean
  signIn: (accessToken: string, user: User, refreshToken: string) => Promise<void>
  signOut: () => Promise<void>
  updateUser: (user: User) => void
  socialSignIn: (supabaseToken: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<{ token: string | null; user: User | null }>({
    token: null,
    user: null,
  })
  const [loading, setLoading] = useState(true)
  const [transitioning, setTransitioning] = useState(false)
  const isSigningInRef = useRef(false)

  async function signIn(accessToken: string, newUser: User, refreshToken: string) {
    if (__DEV__) console.log('[Auth] signIn — role:', newUser.role, 'id:', newUser.id)
    isSigningInRef.current = true
    await Promise.all([
      saveSecure('token', accessToken),
      saveSecure('refreshToken', refreshToken),
      saveSecure('user', JSON.stringify(newUser)),
    ])
    setAuth({ token: accessToken, user: newUser })
    isSigningInRef.current = false
  }

  async function signOut() {
    setTransitioning(true)
    const refreshToken = await getSecure('refreshToken')
    await Promise.all([
      deleteSecure('token'),
      deleteSecure('refreshToken'),
      deleteSecure('user'),
    ])
    invalidarCacheOficina()
    resetarNotificacoes()
    setAuth({ token: null, user: null })
    // Fire-and-forget — não bloqueia o logout local
    if (refreshToken) api.post('/auth/logout', { refreshToken }).catch(() => {})
    supabase.auth.signOut().catch(() => {})
    setTimeout(() => setTransitioning(false), 400)
  }

  async function socialSignIn(supabaseToken: string) {
    if (isSigningInRef.current) return
    isSigningInRef.current = true
    try {
      // Verifica primeiro — evita sobrepor transitioning se já estiver logado
      const savedToken = await getSecure('token')
      if (savedToken) return
      setTransitioning(true)
      const res = await api.post<{ accessToken: string; refreshToken: string; user: User }>(
        '/auth/social', { supabaseToken }
      )
      await signIn(res.accessToken, res.user, res.refreshToken)
      setTimeout(() => setTransitioning(false), 400)
    } catch (err) {
      setTransitioning(false)
      throw err
    } finally {
      isSigningInRef.current = false
    }
  }

  function updateUser(updatedUser: User) {
    setAuth(prev => ({ ...prev, user: updatedUser }))
    saveSecure('user', JSON.stringify(updatedUser))
  }

  useEffect(() => {
    setUnauthorizedCallback(signOut)
  }, [])

  useEffect(() => {
    async function carregarSessao() {
      const [savedToken, savedUser] = await Promise.all([
        getSecure('token'),
        getSecure('user'),
      ])
      if (savedToken && savedUser) {
        try {
          const parsed = JSON.parse(savedUser)
          if (isValidUser(parsed)) {
            if (__DEV__) console.log('[Auth] hydrate — role:', parsed.role)
            setAuth({ token: savedToken, user: parsed })
          } else {
            if (__DEV__) console.warn('[Auth] hydrate — user inválido, fazendo logout')
            await signOut()
          }
        } catch {
          await signOut()
        }
      }
      setLoading(false)
    }
    carregarSessao()
  }, [])

  // Fallback: captura logins sociais que não passaram por handleGoogle (ex: deep link direto)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        try { await socialSignIn(session.access_token) } catch {}
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ token: auth.token, user: auth.user, loading, transitioning, signIn, signOut, updateUser, socialSignIn }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
