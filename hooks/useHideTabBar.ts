import { useNavigation } from 'expo-router'
import { useLayoutEffect } from 'react'

export function useHideTabBar() {
  const navigation = useNavigation()
  useLayoutEffect(() => {
    navigation.setOptions({ tabBarStyle: { display: 'none' } })
  }, [navigation])
}
