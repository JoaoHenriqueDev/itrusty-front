import { Tabs, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Typography } from '../../constants/theme'
import { useAuth } from '../../contexts/AuthContext'

type IconName = keyof typeof Ionicons.glyphMap

const TABS: { name: string; title: string; icon: IconName; iconActive: IconName }[] = [
  { name: 'index',   title: 'Início',   icon: 'home-outline',     iconActive: 'home'          },
  { name: 'agenda',  title: 'Agenda',   icon: 'calendar-outline', iconActive: 'calendar'      },
  { name: 'servicos',title: 'Serviços', icon: 'list-outline',     iconActive: 'list'          },
  { name: 'perfil',  title: 'Perfil',   icon: 'person-outline',   iconActive: 'person'        },
]

export default function OficinaLayout() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user || user.role !== 'OFICINA') {
      router.replace(user?.role === 'MOTORISTA' ? '/(motorista)/' : '/(auth)/login')
    }
  }, [user, loading])

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor:   Colors.accent,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          position:        'absolute',
          bottom:          28,
          left:            0,
          right:           0,
          marginHorizontal: 40,
          backgroundColor: Colors.surface,
          borderRadius:    28,
          borderTopWidth:  0,
          paddingBottom:   8,
          paddingTop:      8,
          height:          64,
          elevation:       8,
          shadowColor:     '#000',
          shadowOffset:    { width: 0, height: 4 },
          shadowOpacity:   0.12,
          shadowRadius:    16,
        },
        tabBarLabelStyle: {
          fontSize:   Typography.size.xs,
          fontWeight: Typography.weight.medium,
        },
      }}
    >
      {TABS.map(({ name, title, icon, iconActive }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? iconActive : icon} size={24} color={color} />
            ),
          }}
        />
      ))}

      {/* Telas de detalhe — sem tab, sem navbar */}
      <Tabs.Screen name="faturamento"      options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="avaliacoes"       options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="agendamento/[id]" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="servico/[id]"     options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="conta"            options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="editar-perfil"    options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="notificacoes"     options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="ajuda"            options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="sobre"            options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="termos"           options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="privacidade"      options={{ href: null, tabBarStyle: { display: 'none' } }} />
    </Tabs>
  )
}
