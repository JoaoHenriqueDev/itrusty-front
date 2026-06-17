import { Slot, useRouter, useSegments, useRootNavigationState } from 'expo-router'
import { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import SplashScreen from '../components/SplashScreen'
import { usePushNotifications } from '../hooks/usePushNotifications'
import { AppAlertProvider } from '../components/ui/AppAlert'
import { ErrorBoundary } from '../components/ErrorBoundary'

function RootLayoutNav() {
  const { token, user, loading, transitioning } = useAuth()
  const router = useRouter()
  const segments = useSegments()
  const navigationState = useRootNavigationState()

  // Registra push e navega para agendamentos ao tocar na notificação
  usePushNotifications(() => {
    if (!user?.role) return
    if (user.role === 'MOTORISTA') router.push('/(motorista)/agendamentos')
    if (user.role === 'OFICINA')   router.push('/(oficina)/agenda' as any)
  })

  useEffect(() => {
    if (!navigationState?.key || loading) return

    const inAuth          = segments[0] === '(auth)'
    const inOnboarding    = segments[0] === '(onboarding)'
    const inMotorista     = segments[0] === '(motorista)'
    const inOficina       = segments[0] === '(oficina)'
    const inPublicRoute   = segments[0] === 'reset-senha' || segments[0] === 'verificar-email'

    if (!token) {
      if (!inAuth && !inPublicRoute) router.replace('/(auth)/login')
      return
    }

    if (!user?.role) {
      if (!inOnboarding) router.replace('/(onboarding)/role')
      return
    }

    if (user.role === 'MOTORISTA' && !inMotorista) {
      router.replace('/(motorista)/')
      return
    }

    if (user.role === 'OFICINA' && !inOficina) {
      router.replace('/(oficina)/')
      return
    }
  }, [token, user, loading, navigationState?.key, segments])

  if (loading || !navigationState?.key) return <SplashScreen />

  return (
    <View style={s.container}>
      <Slot />
      {transitioning && (
        <View style={StyleSheet.absoluteFillObject}>
          <SplashScreen />
        </View>
      )}
    </View>
  )
}

const s = StyleSheet.create({
  container: { flex: 1 },
})

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AppAlertProvider>
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </AppAlertProvider>
    </ErrorBoundary>
  )
}
