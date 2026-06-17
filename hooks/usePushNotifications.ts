import { useEffect, useRef } from 'react'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform, AppState, AppStateStatus } from 'react-native'
import { api } from '../services/api'
import { getSecure, saveSecure } from '../utils/storage'
import { useAuth } from '../contexts/AuthContext'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge:  false,
  }),
})

async function registrarToken() {
  if (!Device.isDevice) return

  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name:             'iTrusty',
        importance:       Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor:       '#F97316',
        sound:            'default',
      })
    }

    const { status: statusAtual } = await Notifications.getPermissionsAsync()
    let statusFinal = statusAtual

    if (statusAtual !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      statusFinal = status
    }

    if (statusFinal !== 'granted') return

    const { data: novoToken } = await Notifications.getDevicePushTokenAsync()

    const tokenSalvo = await getSecure('pushToken')
    if (novoToken === tokenSalvo) return

    await api.patch('/usuario/push-token', { token: novoToken })
    await saveSecure('pushToken', novoToken)
  } catch (err) {
    if (__DEV__) console.error('[Push] Erro ao registrar token:', err instanceof Error ? err.message : String(err))
  }
}

export function usePushNotifications(onTap?: () => void) {
  const { token: jwtToken } = useAuth()

  const onTapRef = useRef(onTap)
  const notifListener    = useRef<Notifications.EventSubscription>()
  const responseListener = useRef<Notifications.EventSubscription>()

  useEffect(() => {
    onTapRef.current = onTap
  }, [onTap])

  useEffect(() => {
    if (jwtToken) registrarToken()
  }, [jwtToken])

  useEffect(() => {
    if (!jwtToken) return
    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') registrarToken()
    })
    return () => sub.remove()
  }, [jwtToken])

  useEffect(() => {
    notifListener.current = Notifications.addNotificationReceivedListener(() => {})

    responseListener.current = Notifications.addNotificationResponseReceivedListener(() => {
      onTapRef.current?.()
    })

    return () => {
      notifListener.current?.remove()
      responseListener.current?.remove()
    }
  }, [])
}
