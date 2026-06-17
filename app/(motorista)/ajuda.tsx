import { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Spacing, Typography, Radii, Shadows } from '../../constants/theme'

type Faq = { pergunta: string; resposta: string }
type Categoria = { titulo: string; icone: keyof typeof Ionicons.glyphMap; itens: Faq[] }

const CATEGORIAS: Categoria[] = [
  {
    titulo: 'Conta e Perfil',
    icone: 'person-circle-outline',
    itens: [
      {
        pergunta: 'Como altero meus dados cadastrais?',
        resposta: 'Vá em Perfil → Editar perfil. Você pode atualizar seu nome, telefone e endereço.',
      },
      {
        pergunta: 'Como adiciono ou troco minha foto de perfil?',
        resposta: 'Na tela de Editar perfil, toque na sua foto ou no ícone de câmera para selecionar uma imagem da sua galeria.',
      },
      {
        pergunta: 'Como altero minha senha?',
        resposta: 'Na tela de login, toque em "Esqueci minha senha". Você receberá um link por e-mail para criar uma nova senha.',
      },
    ],
  },
  {
    titulo: 'Veículos',
    icone: 'car-outline',
    itens: [
      {
        pergunta: 'Como adiciono um novo veículo?',
        resposta: 'Vá em Perfil → Meus veículos → botão "+" no canto superior. Informe marca, modelo, ano e placa.',
      },
      {
        pergunta: 'Posso ter mais de um veículo cadastrado?',
        resposta: 'Sim. Você pode cadastrar quantos veículos precisar e selecionar o veículo desejado na hora de agendar um serviço.',
      },
      {
        pergunta: 'Como removo um veículo?',
        resposta: 'Em Meus veículos, toque no veículo que deseja remover e selecione "Remover veículo". Veículos com agendamentos ativos não podem ser removidos.',
      },
    ],
  },
  {
    titulo: 'Agendamentos',
    icone: 'calendar-outline',
    itens: [
      {
        pergunta: 'Como faço um agendamento?',
        resposta: 'Na aba Início, encontre uma oficina e toque nela. Selecione o serviço desejado, escolha o horário disponível e confirme o agendamento.',
      },
      {
        pergunta: 'Como cancelo um agendamento?',
        resposta: 'Em Meus agendamentos, toque no agendamento e selecione "Cancelar". Recomendamos cancelar com pelo menos 2 horas de antecedência.',
      },
      {
        pergunta: 'Como sei quando meu agendamento foi confirmado?',
        resposta: 'Você receberá uma notificação assim que a oficina aceitar ou recusar seu agendamento. Você também pode verificar o status em Meus agendamentos.',
      },
    ],
  },
  {
    titulo: 'Suporte Técnico',
    icone: 'settings-outline',
    itens: [
      {
        pergunta: 'O aplicativo não está carregando. O que fazer?',
        resposta: 'Verifique sua conexão com a internet. Se o problema persistir, feche e abra o aplicativo novamente. Caso continue, entre em contato com nosso suporte.',
      },
      {
        pergunta: 'Não estou recebendo notificações. O que fazer?',
        resposta: 'Verifique se as notificações do iTrusty estão habilitadas nas configurações do seu celular. Em caso de dúvida, entre em contato com o suporte.',
      },
    ],
  },
]

export default function AjudaMotorista() {
  const insets  = useSafeAreaInsets()
  const router  = useRouter()
  const [busca, setBusca]     = useState('')
  const [abertos, setAbertos] = useState<Set<string>>(new Set())

  function toggleItem(key: string) {
    setAbertos(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const categoriasFiltradas = busca.trim()
    ? CATEGORIAS.map(cat => ({
        ...cat,
        itens: cat.itens.filter(
          it =>
            it.pergunta.toLowerCase().includes(busca.toLowerCase()) ||
            it.resposta.toLowerCase().includes(busca.toLowerCase())
        ),
      })).filter(cat => cat.itens.length > 0)
    : CATEGORIAS

  return (
    <View style={[s.container, { paddingBottom: insets.bottom }]}>
      <View style={[s.header, { paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity style={s.voltarBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={s.headerTitulo}>Central de Ajuda</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        <View style={s.buscaContainer}>
          <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
          <TextInput
            style={s.buscaInput}
            placeholder="Buscar dúvidas..."
            placeholderTextColor={Colors.textMuted}
            value={busca}
            onChangeText={setBusca}
          />
          {busca.length > 0 && (
            <TouchableOpacity onPress={() => setBusca('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {categoriasFiltradas.map(cat => (
          <View key={cat.titulo} style={s.categoriaBloco}>
            <View style={s.categoriaHeader}>
              <Ionicons name={cat.icone} size={18} color={Colors.accent} />
              <Text style={s.categoriaTitulo}>{cat.titulo}</Text>
            </View>
            <View style={s.card}>
              {cat.itens.map((item, idx) => {
                const key    = `${cat.titulo}-${idx}`
                const aberto = abertos.has(key)
                return (
                  <View key={key}>
                    {idx > 0 && <View style={s.divider} />}
                    <TouchableOpacity style={s.faqLinha} onPress={() => toggleItem(key)} activeOpacity={0.7}>
                      <Text style={s.pergunta} numberOfLines={aberto ? undefined : 2}>{item.pergunta}</Text>
                      <Ionicons
                        name={aberto ? 'chevron-up' : 'chevron-down'}
                        size={16}
                        color={Colors.textMuted}
                        style={{ flexShrink: 0 }}
                      />
                    </TouchableOpacity>
                    {aberto && (
                      <View style={s.respostaContainer}>
                        <Text style={s.resposta}>{item.resposta}</Text>
                      </View>
                    )}
                  </View>
                )
              })}
            </View>
          </View>
        ))}

        {categoriasFiltradas.length === 0 && (
          <View style={s.semResultados}>
            <Ionicons name="search-outline" size={40} color={Colors.border} />
            <Text style={s.semResultadosTexto}>Nenhum resultado encontrado</Text>
            <Text style={s.semResultadosSub}>Tente outras palavras ou entre em contato com o suporte</Text>
          </View>
        )}

        <View style={s.suporteCard}>
          <View style={s.suporteIcone}>
            <Ionicons name="chatbubble-ellipses-outline" size={22} color={Colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.suporteTitulo}>Não encontrou o que procurava?</Text>
            <Text style={s.suporteSub}>Nossa equipe está disponível de segunda a sexta, das 8h às 18h</Text>
          </View>
        </View>

        <TouchableOpacity style={s.contatoBtn} activeOpacity={0.8}>
          <Ionicons name="mail-outline" size={18} color={Colors.surface} />
          <Text style={s.contatoBtnTexto}>Falar com o suporte</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const s = StyleSheet.create({
  container:          { flex: 1, backgroundColor: Colors.background },
  header:             { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingBottom: Spacing.sm, backgroundColor: Colors.background },
  voltarBtn:          { width: 40, height: 40, borderRadius: Radii.sm, justifyContent: 'center', alignItems: 'center' },
  headerTitulo:       { fontSize: Typography.size.base, fontWeight: Typography.weight.bold, color: Colors.text },
  scroll:             { paddingHorizontal: Spacing.lg, paddingBottom: Spacing['3xl'] },
  buscaContainer:     { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.surface, borderRadius: Radii.md, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm + 2, marginBottom: Spacing.xl, ...Shadows.sm },
  buscaInput:         { flex: 1, fontSize: Typography.size.md, color: Colors.text },
  categoriaBloco:     { marginBottom: Spacing.xl },
  categoriaHeader:    { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  categoriaTitulo:    { fontSize: Typography.size.sm, fontWeight: Typography.weight.semibold, color: Colors.textSecondary },
  card:               { backgroundColor: Colors.surface, borderRadius: Radii.lg, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', ...Shadows.sm },
  divider:            { height: 1, backgroundColor: Colors.borderLight },
  faqLinha:           { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, paddingHorizontal: Spacing.base, paddingVertical: Spacing.base },
  pergunta:           { flex: 1, fontSize: Typography.size.md, fontWeight: Typography.weight.medium, color: Colors.text, lineHeight: 22 },
  respostaContainer:  { paddingHorizontal: Spacing.base, paddingBottom: Spacing.base },
  resposta:           { fontSize: Typography.size.sm, color: Colors.textSecondary, lineHeight: 21 },
  semResultados:      { alignItems: 'center', paddingVertical: Spacing['3xl'], gap: Spacing.sm },
  semResultadosTexto: { fontSize: Typography.size.base, fontWeight: Typography.weight.semibold, color: Colors.text },
  semResultadosSub:   { fontSize: Typography.size.sm, color: Colors.textMuted, textAlign: 'center' },
  suporteCard:        { flexDirection: 'row', alignItems: 'center', gap: Spacing.base, backgroundColor: Colors.accentLight, borderRadius: Radii.lg, padding: Spacing.base, marginBottom: Spacing.md },
  suporteIcone:       { width: 44, height: 44, borderRadius: Radii.md, backgroundColor: 'rgba(249,115,22,0.12)', justifyContent: 'center', alignItems: 'center' },
  suporteTitulo:      { fontSize: Typography.size.sm, fontWeight: Typography.weight.bold, color: Colors.text, marginBottom: 2 },
  suporteSub:         { fontSize: Typography.size.xs, color: Colors.textSecondary, lineHeight: 18 },
  contatoBtn:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.accent, borderRadius: Radii.full, paddingVertical: Spacing.md, ...Shadows.sm },
  contatoBtnTexto:    { fontSize: Typography.size.md, fontWeight: Typography.weight.bold, color: Colors.surface },
})
