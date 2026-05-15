import { useRef, useState } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, StatusBar, ScrollView,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../contexts/AuthContext'
import { Colors, Spacing, Typography, Radii } from '../constants/theme'

const NAVY  = '#0D1F35'
const CREME = '#EDE8DC'
const CINZA = '#F5F4EF'

// ─── Slides ──────────────────────────────────────────────────────────────────

function Slide1() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s1.scroll}>
      <View style={s1.badge}>
        <Ionicons name="shield-checkmark-outline" size={12} color={Colors.accent} />
        <Text style={s1.badgeTexto}>TRAÇOS DE CONFIANÇA</Text>
      </View>

      <Text style={s1.titulo}>
        {'Achar oficina boa\nnão deveria ser\n'}
        <Text style={s1.tituloAcento}>na sorte.</Text>
      </Text>

      <Text style={s1.texto}>
        A iTrusty conecta motoristas a oficinas verificadas.
      </Text>

      <View style={s1.stats}>
        {[
          { icone: 'checkmark-circle-outline' as const, valor: '+340', label: 'OFICINAS' },
          { icone: 'star-outline'             as const, valor: '4.8',  label: 'MÉDIA'    },
          { icone: 'shield-outline'           as const, valor: '0',    label: 'SURPRESA' },
        ].map(({ icone, valor, label }) => (
          <View key={label} style={s1.statCard}>
            <Ionicons name={icone} size={16} color={Colors.accent} />
            <Text style={s1.statValor}>{valor}</Text>
            <Text style={s1.statLabel}>{label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

function Slide2() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s2.scroll}>
      <View style={s2.badge}>
        <Ionicons name="ribbon-outline" size={12} color={Colors.accent} />
        <Text style={s2.badgeTexto}>SELO iTRUSTY</Text>
      </View>

      {/* Mock de card de oficina verificada */}
      <View style={s2.card}>
        <View style={s2.cardBanner}>
          <Text style={s2.cardBannerTexto}>OFICINA VERIFICADA</Text>
          <View style={s2.cardBannerLinhas}>
            {[...Array(6)].map((_, i) => (
              <View key={i} style={[s2.cardBannerLinha, { opacity: 0.08 + i * 0.03 }]} />
            ))}
          </View>
        </View>
        <View style={s2.cardInfo}>
          <View style={s2.cardIconBox}>
            <Ionicons name="construct" size={18} color={Colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s2.cardNome}>Garagem do Léo</Text>
            <Text style={s2.cardSub}>★ 4.9 · 312 serviços · doc. ok</Text>
          </View>
          <Ionicons name="checkmark-circle" size={22} color={Colors.accent} />
        </View>
      </View>

      <Text style={s2.labelSelo}>NÓS CONFERIMOS — VOCÊ ESCOLHE</Text>

      <Text style={s2.titulo}>
        {'Toda oficina\npassa pelo\n'}
        <Text style={s2.tituloAcento}>selo iTrusty.</Text>
      </Text>

      <Text style={s2.texto}>
        CNPJ, avaliações reais e critérios de verificação.
      </Text>
    </ScrollView>
  )
}

function Slide3() {
  const features = [
    { icone: 'calendar-outline'      as const, titulo: 'Escolhe data e horário',      sub: 'Sem ligação, sem ir até lá.'          },
    { icone: 'checkmark-done-outline' as const, titulo: 'Recebe confirmação em 30min',  sub: 'A oficina aceita pelo app.'            },
    { icone: 'notifications-outline'  as const, titulo: 'Avisa quando ficar pronto',    sub: 'Você só volta quando der certo.'       },
  ]

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s3.scroll}>
      <View style={s3.badge}>
        <Text style={s3.badgeTexto}>2 TOQUES · 30 SEGUNDOS</Text>
      </View>

      <Text style={s3.titulo}>
        {'Agenda.\nAcompanha.\nResolve.'}
      </Text>

      <View style={s3.features}>
        {features.map(({ icone, titulo, sub }) => (
          <View key={titulo} style={s3.featureCard}>
            <View style={s3.featureIconBox}>
              <Ionicons name={icone} size={20} color={Colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s3.featureTitulo}>{titulo}</Text>
              <Text style={s3.featureSub}>{sub}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

// ─── Tela principal ──────────────────────────────────────────────────────────

export default function Intro() {
  const { marcarIntroCompleto } = useAuth()
  const router  = useRouter()
  const insets  = useSafeAreaInsets()
  const [slide, setSlide] = useState(0)
  const fade    = useRef(new Animated.Value(1)).current

  const bgs        = [NAVY, CINZA, Colors.accent]
  const pularCores = ['rgba(255,255,255,0.55)', Colors.textMuted, 'rgba(255,255,255,0.65)']
  const bg         = bgs[slide]

  async function concluir() {
    await marcarIntroCompleto()
    router.replace('/(auth)/login')
  }

  function irPara(idx: number) {
    Animated.timing(fade, { toValue: 0, duration: 140, useNativeDriver: true }).start(() => {
      setSlide(idx)
      Animated.timing(fade, { toValue: 1, duration: 200, useNativeDriver: true }).start()
    })
  }

  async function proximo() {
    if (slide < 2) irPara(slide + 1)
    else await concluir()
  }

  function dotColor(i: number) {
    const ativo = i === slide
    if (slide === 1) return ativo ? NAVY : 'rgba(0,0,0,0.18)'
    return ativo ? (slide === 2 ? NAVY : Colors.accent) : 'rgba(255,255,255,0.35)'
  }

  return (
    <View style={[s.container, { backgroundColor: bg }]}>
      <StatusBar
        barStyle={slide === 1 ? 'dark-content' : 'light-content'}
        backgroundColor={bg}
        translucent={false}
      />

      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + Spacing.sm }]}>
        <Text style={[s.logo, slide === 1 && { color: NAVY }]}>iTrusty</Text>
        <TouchableOpacity onPress={concluir} hitSlop={12}>
          <Text style={[s.pular, { color: pularCores[slide] }]}>Pular</Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo animado */}
      <Animated.View style={[s.content, { opacity: fade }]}>
        {slide === 0 && <Slide1 />}
        {slide === 1 && <Slide2 />}
        {slide === 2 && <Slide3 />}
      </Animated.View>

      {/* Footer */}
      <View style={[s.footer, { paddingBottom: Math.max(insets.bottom + Spacing.base, Spacing.xl) }]}>
        {/* Indicadores */}
        <View style={s.indicadores}>
          <View style={s.dots}>
            {[0, 1, 2].map(i => (
              <TouchableOpacity key={i} onPress={() => irPara(i)} hitSlop={8}>
                <View style={[s.dot, i === slide ? s.dotAtivo : s.dotInativo, { backgroundColor: dotColor(i) }]} />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[s.contador, { color: slide === 1 ? Colors.textMuted : 'rgba(255,255,255,0.5)' }]}>
            {slide + 1} / 3
          </Text>
        </View>

        {/* Botão principal */}
        <TouchableOpacity
          style={[s.botao, {
            backgroundColor: slide === 0 ? CREME : slide === 1 ? Colors.accent : NAVY,
          }]}
          onPress={proximo}
          activeOpacity={0.85}
        >
          <Text style={[s.botaoTexto, { color: slide === 0 ? NAVY : '#fff' }]}>
            {slide === 2 ? 'Começar agora' : 'Próximo'}
          </Text>
          <Ionicons name="arrow-forward" size={18} color={slide === 0 ? NAVY : '#fff'} />
        </TouchableOpacity>

        {/* Link entrar */}
        <TouchableOpacity onPress={concluir} hitSlop={10}>
          <Text style={[s.entrar, { color: slide === 1 ? Colors.textSecondary : 'rgba(255,255,255,0.65)' }]}>
            Já tenho conta{'  '}
            <Text style={[s.entrarBold, { color: slide === 1 ? NAVY : '#fff' }]}>Entrar</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

// ─── Estilos globais da tela ─────────────────────────────────────────────────

const s = StyleSheet.create({
  container:  { flex: 1 },
  header:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingBottom: Spacing.sm },
  logo:       { fontSize: Typography.size.lg, fontWeight: Typography.weight.extrabold, color: '#fff', letterSpacing: -0.5 },
  pular:      { fontSize: Typography.size.sm, fontWeight: Typography.weight.semibold },
  content:    { flex: 1 },
  footer:     { paddingHorizontal: Spacing.lg, paddingTop: Spacing.base, gap: Spacing.base },
  indicadores:{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dots:       { flexDirection: 'row', gap: Spacing.xs },
  dot:        { height: 4, borderRadius: 2 },
  dotAtivo:   { width: 24 },
  dotInativo: { width: 12 },
  contador:   { fontSize: Typography.size.xs, fontWeight: Typography.weight.semibold },
  botao:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, borderRadius: Radii.full, paddingVertical: Spacing.base + 2 },
  botaoTexto: { fontSize: Typography.size.base, fontWeight: Typography.weight.bold },
  entrar:     { textAlign: 'center', fontSize: Typography.size.sm },
  entrarBold: { fontWeight: Typography.weight.bold },
})

// ─── Estilos slide 1 (navy) ───────────────────────────────────────────────────

const s1 = StyleSheet.create({
  scroll:      { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg },
  badge:       { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, alignSelf: 'flex-start', backgroundColor: 'rgba(249,115,22,0.15)', borderRadius: Radii.full, paddingHorizontal: Spacing.md, paddingVertical: 5, marginBottom: Spacing.xl },
  badgeTexto:  { fontSize: Typography.size.xs, fontWeight: Typography.weight.bold, color: Colors.accent, letterSpacing: 0.5 },
  titulo:      { fontSize: Typography.size['4xl'], fontWeight: Typography.weight.extrabold, color: '#fff', lineHeight: Typography.size['4xl'] * 1.15, marginBottom: Spacing.base },
  tituloAcento:{ color: Colors.accent },
  texto:       { fontSize: Typography.size.md, color: 'rgba(255,255,255,0.65)', lineHeight: Typography.size.md * 1.6, marginBottom: Spacing.xl },
  stats:       { flexDirection: 'row', gap: Spacing.sm },
  statCard:    { flex: 1, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: Radii.md, padding: Spacing.md, alignItems: 'center', gap: 4 },
  statValor:   { fontSize: Typography.size.xl, fontWeight: Typography.weight.extrabold, color: '#fff' },
  statLabel:   { fontSize: Typography.size.xs, color: 'rgba(255,255,255,0.5)', letterSpacing: 0.5 },
})

// ─── Estilos slide 2 (cinza claro) ───────────────────────────────────────────

const s2 = StyleSheet.create({
  scroll:          { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg },
  badge:           { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, alignSelf: 'flex-start', backgroundColor: 'rgba(249,115,22,0.1)', borderRadius: Radii.full, paddingHorizontal: Spacing.md, paddingVertical: 5, marginBottom: Spacing.base },
  badgeTexto:      { fontSize: Typography.size.xs, fontWeight: Typography.weight.bold, color: Colors.accent, letterSpacing: 0.5 },
  card:            { borderRadius: Radii.lg, overflow: 'hidden', marginBottom: Spacing.base, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)' },
  cardBanner:      { backgroundColor: NAVY, height: 110, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  cardBannerTexto: { fontSize: Typography.size.xs, fontWeight: Typography.weight.bold, color: 'rgba(255,255,255,0.4)', letterSpacing: 2 },
  cardBannerLinhas:{ position: 'absolute', bottom: 0, left: 0, right: 0, gap: 10 },
  cardBannerLinha: { height: 1, backgroundColor: '#fff' },
  cardInfo:        { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md, backgroundColor: '#fff' },
  cardIconBox:     { width: 38, height: 38, borderRadius: Radii.sm, backgroundColor: 'rgba(249,115,22,0.1)', justifyContent: 'center', alignItems: 'center' },
  cardNome:        { fontSize: Typography.size.sm, fontWeight: Typography.weight.bold, color: NAVY },
  cardSub:         { fontSize: Typography.size.xs, color: Colors.textMuted },
  labelSelo:       { fontSize: Typography.size.xs, fontWeight: Typography.weight.semibold, color: Colors.accent, letterSpacing: 0.8, marginBottom: Spacing.sm },
  titulo:          { fontSize: Typography.size['3xl'], fontWeight: Typography.weight.extrabold, color: NAVY, lineHeight: Typography.size['3xl'] * 1.2, marginBottom: Spacing.base },
  tituloAcento:    { color: Colors.accent },
  texto:           { fontSize: Typography.size.md, color: Colors.textSecondary, lineHeight: Typography.size.md * 1.6 },
})

// ─── Estilos slide 3 (laranja) ───────────────────────────────────────────────

const s3 = StyleSheet.create({
  scroll:        { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg },
  badge:         { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: Radii.full, paddingHorizontal: Spacing.md, paddingVertical: 5, marginBottom: Spacing.xl },
  badgeTexto:    { fontSize: Typography.size.xs, fontWeight: Typography.weight.bold, color: '#fff', letterSpacing: 0.5 },
  titulo:        { fontSize: Typography.size['4xl'], fontWeight: Typography.weight.extrabold, color: '#fff', lineHeight: Typography.size['4xl'] * 1.15, marginBottom: Spacing.xl },
  features:      { gap: Spacing.sm },
  featureCard:   { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: Radii.md, padding: Spacing.md },
  featureIconBox:{ width: 38, height: 38, borderRadius: Radii.sm, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  featureTitulo: { fontSize: Typography.size.sm, fontWeight: Typography.weight.bold, color: '#fff', marginBottom: 2 },
  featureSub:    { fontSize: Typography.size.xs, color: 'rgba(255,255,255,0.7)' },
})
