import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Spacing, Typography, Radii } from '../../constants/theme'

type Secao = { titulo: string; icone: keyof typeof Ionicons.glyphMap; conteudo: string }

const SECOES: Secao[] = [
  {
    titulo: '1. Introdução',
    icone: 'document-text-outline',
    conteudo:
      'Esta Política de Privacidade descreve como os dados pessoais dos usuários são coletados, utilizados, armazenados e compartilhados pelo Aplicativo. Ao utilizar a plataforma, o usuário concorda com as práticas descritas nesta Política.',
  },
  {
    titulo: '2. Dados Coletados',
    icone: 'person-outline',
    conteudo:
      'Poderemos coletar: dados cadastrais (nome, telefone, e-mail, senha criptografada e informações do veículo); dados de uso (histórico de acessos, interações na plataforma, agendamentos realizados, avaliações e pesquisas realizadas); dados técnicos (IP, tipo de dispositivo, sistema operacional, geolocalização aproximada e logs de acesso).',
  },
  {
    titulo: '3. Finalidade do Tratamento',
    icone: 'settings-outline',
    conteudo:
      'Os dados poderão ser utilizados para: funcionamento da plataforma, realização de agendamentos, comunicação entre usuários e estabelecimentos, alertas de manutenção preventiva, melhoria da experiência do usuário, atendimento ao cliente, segurança da plataforma, prevenção a fraudes e cumprimento de obrigações legais.',
  },
  {
    titulo: '4. Compartilhamento de Dados',
    icone: 'share-outline',
    conteudo:
      'Os dados poderão ser compartilhados com estabelecimentos parceiros (quando necessário para execução dos serviços), com fornecedores de infraestrutura tecnológica, com autoridades públicas (mediante obrigação legal) e em operações societárias futuras. O Aplicativo não comercializa dados pessoais de usuários.',
  },
  {
    titulo: '5. Armazenamento e Segurança',
    icone: 'shield-outline',
    conteudo:
      'Adotamos medidas técnicas e administrativas razoáveis para proteção dos dados pessoais. Entretanto, nenhum sistema é completamente seguro, não sendo possível garantir segurança absoluta.',
  },
  {
    titulo: '6. Cookies e Tecnologias Semelhantes',
    icone: 'eye-outline',
    conteudo:
      'O Aplicativo poderá utilizar cookies e tecnologias semelhantes para melhorar a navegação, personalizar a experiência, realizar análises estatísticas e garantir a segurança da plataforma.',
  },
  {
    titulo: '7. Direitos do Usuário',
    icone: 'person-circle-outline',
    conteudo:
      'Nos termos da LGPD (Lei nº 13.709/2018), o usuário poderá solicitar: confirmação de tratamento, acesso aos dados, correção de dados, exclusão de dados, portabilidade e revogação de consentimento. As solicitações poderão ser realizadas pelos canais de atendimento da plataforma.',
  },
  {
    titulo: '8. Retenção de Dados',
    icone: 'time-outline',
    conteudo:
      'Os dados poderão ser mantidos pelo período necessário para cumprimento de obrigações legais, exercício regular de direitos, prevenção a fraudes e continuidade operacional.',
  },
  {
    titulo: '9. Dados de Menores',
    icone: 'shield-checkmark-outline',
    conteudo:
      'A plataforma não é destinada a menores de 18 anos. Caso seja identificado cadastro irregular de menor, os dados poderão ser removidos.',
  },
  {
    titulo: '10. Alterações desta Política',
    icone: 'refresh-outline',
    conteudo:
      'Esta Política poderá ser alterada periodicamente. A versão atualizada será disponibilizada no Aplicativo.',
  },
  {
    titulo: '11. Contato',
    icone: 'mail-outline',
    conteudo:
      'Em caso de dúvidas relacionadas a estes Termos ou à Política de Privacidade, o usuário poderá entrar em contato pelos canais oficiais disponibilizados na plataforma.',
  },
]

export default function PrivacidadeMotorista() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  return (
    <View style={[s.container, { paddingBottom: insets.bottom }]}>
      <View style={[s.header, { paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity style={s.voltarBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={s.headerTitulo}>Política de Privacidade</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        <Text style={s.atualizacao}>Última atualização: maio de 2026</Text>

        <View style={s.lgpdBadge}>
          <Ionicons name="shield-checkmark" size={16} color={Colors.success} />
          <Text style={s.lgpdTexto}>Em conformidade com a LGPD (Lei nº 13.709/2018)</Text>
        </View>

        <Text style={s.intro}>
          Sua privacidade é fundamental para nós. Esta política explica quais dados coletamos, como
          os utilizamos e quais são seus direitos.
        </Text>

        {SECOES.map((secao, idx) => (
          <View key={secao.titulo} style={s.secao}>
            <View style={s.secaoHeader}>
              <View style={s.secaoNumero}>
                <Text style={s.secaoNumeroTexto}>{idx + 1}</Text>
              </View>
              <View style={s.secaoIcone}>
                <Ionicons name={secao.icone} size={16} color={Colors.accent} />
              </View>
              <Text style={s.secaoTitulo}>{secao.titulo}</Text>
            </View>
            <Text style={s.secaoTexto}>{secao.conteudo}</Text>
          </View>
        ))}

        <View style={s.contatoCard}>
          <Ionicons name="mail-outline" size={20} color={Colors.accent} />
          <View style={{ flex: 1 }}>
            <Text style={s.contatoTitulo}>Contato</Text>
            <Text style={s.contatoTexto}>contato@itrusty.com.br</Text>
            <Text style={s.contatoSub}>Resposta em até 15 dias úteis</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const s = StyleSheet.create({
  container:        { flex: 1, backgroundColor: Colors.background },
  header:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingBottom: Spacing.sm, backgroundColor: Colors.background },
  voltarBtn:        { width: 40, height: 40, borderRadius: Radii.sm, justifyContent: 'center', alignItems: 'center' },
  headerTitulo:     { fontSize: Typography.size.base, fontWeight: Typography.weight.bold, color: Colors.text },
  scroll:           { paddingHorizontal: Spacing.lg, paddingBottom: Spacing['3xl'] },
  atualizacao:      { fontSize: Typography.size.xs, color: Colors.textMuted, marginBottom: Spacing.sm, fontStyle: 'italic' },
  lgpdBadge:        { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, backgroundColor: Colors.successLight, borderRadius: Radii.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, alignSelf: 'flex-start', marginBottom: Spacing.base },
  lgpdTexto:        { fontSize: Typography.size.xs, color: Colors.success, fontWeight: Typography.weight.semibold },
  intro:            { fontSize: Typography.size.sm, color: Colors.textSecondary, lineHeight: 22, marginBottom: Spacing.xl },
  secao:            { marginBottom: Spacing.xl, backgroundColor: Colors.surface, borderRadius: Radii.lg, borderWidth: 1, borderColor: Colors.border, padding: Spacing.base },
  secaoHeader:      { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  secaoNumero:      { width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  secaoNumeroTexto: { fontSize: Typography.size.xs, fontWeight: Typography.weight.bold, color: Colors.surface },
  secaoIcone:       { width: 28, height: 28, borderRadius: Radii.xs, backgroundColor: Colors.accentLight, justifyContent: 'center', alignItems: 'center' },
  secaoTitulo:      { flex: 1, fontSize: Typography.size.md, fontWeight: Typography.weight.bold, color: Colors.text },
  secaoTexto:       { fontSize: Typography.size.sm, color: Colors.textSecondary, lineHeight: 22 },
  contatoCard:      { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.base, backgroundColor: Colors.accentLight, borderRadius: Radii.lg, padding: Spacing.base, marginTop: Spacing.base, borderWidth: 1, borderColor: `${Colors.accent}30` },
  contatoTitulo:    { fontSize: Typography.size.sm, fontWeight: Typography.weight.bold, color: Colors.text },
  contatoTexto:     { fontSize: Typography.size.sm, color: Colors.accent, fontWeight: Typography.weight.semibold, marginTop: 2 },
  contatoSub:       { fontSize: Typography.size.xs, color: Colors.textMuted, marginTop: 2 },
})
