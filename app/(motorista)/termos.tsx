import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Spacing, Typography, Radii } from '../../constants/theme'

type Secao = { titulo: string; conteudo: string }

const SECOES: Secao[] = [
  {
    titulo: '1. Aceitação dos Termos',
    conteudo:
      'Ao acessar, instalar ou utilizar o aplicativo ("Aplicativo"), o usuário declara que leu, compreendeu e concorda integralmente com os presentes Termos de Uso e com a Política de Privacidade. Caso o usuário não concorde com quaisquer disposições destes Termos, deverá interromper imediatamente a utilização do Aplicativo.',
  },
  {
    titulo: '2. Objeto da Plataforma',
    conteudo:
      'O Aplicativo consiste em uma plataforma digital destinada à conexão entre motoristas e estabelecimentos do segmento automotivo, incluindo oficinas mecânicas, centros automotivos, lava-rápidos, borracharias, serviços de alinhamento e balanceamento, troca de óleo e serviços automotivos em geral. A plataforma poderá disponibilizar funcionalidades como busca e localização de estabelecimentos, avaliações e classificações, solicitação de agendamentos, histórico de serviços, alertas de manutenção preventiva e recursos de relacionamento entre usuários e estabelecimentos.',
  },
  {
    titulo: '3. Natureza da Plataforma',
    conteudo:
      'O Aplicativo atua exclusivamente como intermediador tecnológico entre usuários e estabelecimentos parceiros. O Aplicativo não executa diretamente quaisquer serviços automotivos, não sendo responsável por execução técnica dos serviços, qualidade dos serviços prestados, garantias mecânicas, peças utilizadas, orçamentos realizados, prazos de entrega, condutas dos estabelecimentos ou eventuais danos materiais ou morais decorrentes da prestação dos serviços. Toda responsabilidade pela execução dos serviços é exclusivamente do estabelecimento contratado.',
  },
  {
    titulo: '4. Cadastro de Usuários',
    conteudo:
      'Para utilização de determinadas funcionalidades, poderá ser necessário realizar cadastro. O usuário declara que fornecerá informações verdadeiras e atualizadas, é responsável pela segurança de sua conta, não compartilhará credenciais de acesso e é maior de 18 anos ou legalmente emancipado. O Aplicativo poderá suspender ou cancelar contas em caso de informações falsas, uso indevido da plataforma, fraudes, violações legais ou condutas abusivas.',
  },
  {
    titulo: '5. Cadastro de Estabelecimentos',
    conteudo:
      'Os estabelecimentos cadastrados declaram possuir autorização legal para funcionamento e serem responsáveis por licenças, alvarás, obrigações tributárias, qualidade dos serviços, garantias oferecidas e cumprimento da legislação aplicável. O selo de verificação eventualmente concedido pela plataforma possui caráter meramente informativo e não representa garantia absoluta da qualidade ou regularidade dos serviços.',
  },
  {
    titulo: '6. Agendamentos',
    conteudo:
      'A plataforma poderá disponibilizar recursos de solicitação e gestão de agendamentos. O usuário reconhece que o agendamento constitui apenas uma solicitação, que a confirmação depende exclusivamente do estabelecimento e que cancelamentos, alterações e condições comerciais poderão variar conforme o estabelecimento. O Aplicativo não garante disponibilidade de horários, execução dos serviços ou preços previamente estimados.',
  },
  {
    titulo: '7. Avaliações e Conteúdo dos Usuários',
    conteudo:
      'Os usuários poderão publicar avaliações e comentários. É proibida a publicação de conteúdos falsos, difamatórios, ofensivos, discriminatórios, ilícitos ou que violem direitos de terceiros. O Aplicativo poderá remover conteúdos sem aviso prévio.',
  },
  {
    titulo: '8. Limitação de Responsabilidade',
    conteudo:
      'Na máxima extensão permitida pela legislação aplicável, o Aplicativo não será responsável por lucros cessantes, perdas indiretas, danos emergentes, falhas mecânicas, serviços inadequados, danos causados por terceiros, problemas decorrentes de indisponibilidade da plataforma ou informações fornecidas por estabelecimentos ou usuários. A responsabilidade total do Aplicativo, quando aplicável, limitar-se-á ao valor eventualmente pago pelo usuário nos últimos 12 meses.',
  },
  {
    titulo: '9. Disponibilidade da Plataforma',
    conteudo:
      'O Aplicativo poderá sofrer interrupções, atualizações, instabilidades e manutenções programadas. Não há garantia de disponibilidade contínua ou livre de erros.',
  },
  {
    titulo: '10. Propriedade Intelectual',
    conteudo:
      'Todos os direitos relacionados à plataforma, incluindo marca, layout, código-fonte, funcionalidades, design, conteúdos, logotipos e bases de dados, são de propriedade exclusiva do Aplicativo ou de seus licenciadores. É proibida a reprodução, modificação ou exploração sem autorização prévia.',
  },
  {
    titulo: '11. Privacidade e Proteção de Dados',
    conteudo:
      'O tratamento de dados pessoais ocorrerá conforme descrito na Política de Privacidade. Ao utilizar o Aplicativo, o usuário declara ciência sobre a coleta e tratamento de dados necessários para funcionamento da plataforma.',
  },
  {
    titulo: '12. Suspensão e Encerramento',
    conteudo:
      'O Aplicativo poderá suspender ou encerrar contas a qualquer momento em caso de violação destes Termos, atividades suspeitas, fraudes ou uso indevido da plataforma.',
  },
  {
    titulo: '13. Modificações dos Termos',
    conteudo:
      'Os presentes Termos poderão ser alterados a qualquer momento. As versões atualizadas serão disponibilizadas no Aplicativo. A continuidade de uso após alterações implica aceitação das novas condições.',
  },
  {
    titulo: '14. Legislação Aplicável e Foro',
    conteudo:
      'Os presentes Termos serão regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da comarca de São Paulo/SP para dirimir quaisquer controvérsias decorrentes destes Termos.',
  },
]

export default function TermosMotorista() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  return (
    <View style={[s.container, { paddingBottom: insets.bottom }]}>
      <View style={[s.header, { paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity style={s.voltarBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={s.headerTitulo}>Termos de Uso</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        <Text style={s.atualizacao}>Última atualização: maio de 2026</Text>

        <Text style={s.intro}>
          Leia atentamente estes Termos de Uso antes de utilizar o aplicativo iTrusty. Estes termos
          constituem um acordo legal entre você e a iTrusty Tecnologia Ltda.
        </Text>

        {SECOES.map((secao) => (
          <View key={secao.titulo} style={s.secao}>
            <Text style={s.secaoTitulo}>{secao.titulo}</Text>
            <Text style={s.secaoTexto}>{secao.conteudo}</Text>
          </View>
        ))}

        <View style={s.contatoCard}>
          <Ionicons name="mail-outline" size={18} color={Colors.accent} />
          <View style={{ flex: 1 }}>
            <Text style={s.contatoTitulo}>Dúvidas sobre os termos?</Text>
            <Text style={s.contatoTexto}>contato@itrusty.com.br</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const s = StyleSheet.create({
  container:     { flex: 1, backgroundColor: Colors.background },
  header:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingBottom: Spacing.sm, backgroundColor: Colors.background },
  voltarBtn:     { width: 40, height: 40, borderRadius: Radii.sm, justifyContent: 'center', alignItems: 'center' },
  headerTitulo:  { fontSize: Typography.size.base, fontWeight: Typography.weight.bold, color: Colors.text },
  scroll:        { paddingHorizontal: Spacing.lg, paddingBottom: Spacing['3xl'] },
  atualizacao:   { fontSize: Typography.size.xs, color: Colors.textMuted, marginBottom: Spacing.base, fontStyle: 'italic' },
  intro:         { fontSize: Typography.size.sm, color: Colors.textSecondary, lineHeight: 22, marginBottom: Spacing.xl, backgroundColor: Colors.accentLight, borderRadius: Radii.md, padding: Spacing.base, borderLeftWidth: 3, borderLeftColor: Colors.accent },
  secao:         { marginBottom: Spacing.xl },
  secaoTitulo:   { fontSize: Typography.size.md, fontWeight: Typography.weight.bold, color: Colors.text, marginBottom: Spacing.sm },
  secaoTexto:    { fontSize: Typography.size.sm, color: Colors.textSecondary, lineHeight: 22 },
  contatoCard:   { flexDirection: 'row', alignItems: 'center', gap: Spacing.base, backgroundColor: Colors.surface, borderRadius: Radii.lg, borderWidth: 1, borderColor: Colors.border, padding: Spacing.base, marginTop: Spacing.base },
  contatoTitulo: { fontSize: Typography.size.sm, fontWeight: Typography.weight.semibold, color: Colors.text },
  contatoTexto:  { fontSize: Typography.size.sm, color: Colors.accent, marginTop: 2 },
})
