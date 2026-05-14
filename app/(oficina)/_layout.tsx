import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Typography, Shadows } from '../../constants/theme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type IconName = keyof typeof Ionicons.glyphMap

const TABS: { name: string; title: string; icon: IconName; iconActive: IconName }[] = [
  { name: 'index',   title: 'Início',   icon: 'home-outline',     iconActive: 'home'          },
  { name: 'agenda',  title: 'Agenda',   icon: 'calendar-outline', iconActive: 'calendar'      },
  { name: 'servicos',title: 'Serviços', icon: 'list-outline',     iconActive: 'list'          },
  { name: 'perfil',  title: 'Perfil',   icon: 'person-outline',   iconActive: 'person'        },
]

export default function OficinaLayout() {
  const insets = useSafeAreaInsets()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor:   Colors.accent,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          position:         'absolute',
          bottom:           insets.bottom + 10,
          marginHorizontal: 16,
          borderRadius:     24,
          backgroundColor:  Colors.surface,
          borderTopWidth:   0,
          height:           64,
          paddingTop:       8,
          paddingBottom:    8,
          ...Shadows.md,
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

      {/* Telas de detalhe — sem tab */}
      <Tabs.Screen name="faturamento"       options={{ href: null }} />
      <Tabs.Screen name="avaliacoes"        options={{ href: null }} />
      <Tabs.Screen name="agendamento/[id]" options={{ href: null }} />
      <Tabs.Screen name="servico/[id]"     options={{ href: null }} />
      <Tabs.Screen name="conta"            options={{ href: null }} />
      <Tabs.Screen name="editar-perfil"    options={{ href: null }} />
      <Tabs.Screen name="notificacoes"     options={{ href: null }} />
      <Tabs.Screen name="ajuda"            options={{ href: null }} />
      <Tabs.Screen name="sobre"            options={{ href: null }} />
      <Tabs.Screen name="termos"           options={{ href: null }} />
      <Tabs.Screen name="privacidade"      options={{ href: null }} />
    </Tabs>
  )
}
