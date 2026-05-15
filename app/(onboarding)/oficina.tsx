import { useState } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator,
  Modal, FlatList, Pressable,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../services/api'
import { Colors, Spacing, Typography, Radii } from '../../constants/theme'
import { Input } from '../../components/ui/Input'
import { formatCep, formatCnpj, formatCelular } from '../../utils/formatters'

// ─── Nichos ──────────────────────────────────────────────────────────────────

const CATEGORIAS = [
  'MECANICA_GERAL', 'TROCA_OLEO', 'DIAGNOSTICO', 'FREIOS', 'SUSPENSAO',
  'ELETRICA', 'BORRACHARIA', 'ESTETICA', 'DETAILING', 'FUNILARIA',
  'PINTURA', 'MARTELINHO', 'AR_CONDICIONADO', 'VIDROS', 'PERFORMANCE',
  'CUSTOMIZACAO', 'HIBRIDOS', 'ELETRICOS',
] as const
type Categoria = typeof CATEGORIAS[number]

const CATEGORIA_LABELS: Record<Categoria, string> = {
  MECANICA_GERAL:  'Mecânica Geral',
  TROCA_OLEO:      'Troca de Óleo',
  DIAGNOSTICO:     'Diagnóstico',
  FREIOS:          'Freios',
  SUSPENSAO:       'Suspensão',
  ELETRICA:        'Elétrica',
  BORRACHARIA:     'Borracharia',
  ESTETICA:        'Estética Automotiva',
  DETAILING:       'Detailing',
  FUNILARIA:       'Funilaria',
  PINTURA:         'Pintura',
  MARTELINHO:      'Martelinho de Ouro',
  AR_CONDICIONADO: 'Ar-condicionado',
  VIDROS:          'Vidros',
  PERFORMANCE:     'Performance',
  CUSTOMIZACAO:    'Customização',
  HIBRIDOS:        'Híbridos',
  ELETRICOS:       'Elétricos',
}

// ─── Pagamentos ───────────────────────────────────────────────────────────────

const PAGAMENTOS = [
  'PIX', 'DINHEIRO', 'CARTAO_CREDITO', 'CARTAO_DEBITO',
  'TRANSFERENCIA', 'BOLETO', 'PARCELADO', 'CHEQUE',
] as const
type Pagamento = typeof PAGAMENTOS[number]

const PAGAMENTO_LABELS: Record<Pagamento, string> = {
  PIX:            'Pix',
  DINHEIRO:       'Dinheiro',
  CARTAO_CREDITO: 'Cartão de Crédito',
  CARTAO_DEBITO:  'Cartão de Débito',
  TRANSFERENCIA:  'Transferência Bancária',
  BOLETO:         'Boleto',
  PARCELADO:      'Parcelado',
  CHEQUE:         'Cheque',
}

// ─── Dropdown multi-select ────────────────────────────────────────────────────

type DropdownProps = {
  itens: readonly string[]
  labels: Record<string, string>
  selecionados: string[]
  onChange: (v: string[]) => void
  placeholder: string
  titulo: string
}

function MultiDropdown({ itens, labels, selecionados, onChange, placeholder, titulo }: DropdownProps) {
  const [aberto, setAberto] = useState(false)
  const [temp, setTemp]     = useState<string[]>([])

  function abrir() {
    setTemp(selecionados)
    setAberto(true)
  }

  function toggle(item: string) {
    setTemp(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item])
  }

  function confirmar() {
    onChange(temp)
    setAberto(false)
  }

  const label = selecionados.length === 0
    ? placeholder
    : selecionados.length === 1
    ? labels[selecionados[0]]
    : `${selecionados.length} selecionados`

  return (
    <>
      <TouchableOpacity style={s.dropdown} onPress={abrir} activeOpacity={0.7}>
        <Text style={[s.dropdownTexto, selecionados.length === 0 && s.dropdownPlaceholder]}>
          {label}
        </Text>
        <Ionicons name="chevron-down" size={18} color={Colors.textSecondary} />
      </TouchableOpacity>

      <Modal visible={aberto} transparent animationType="fade" onRequestClose={() => setAberto(false)}>
        <Pressable style={s.overlay} onPress={() => setAberto(false)}>
          <Pressable style={s.sheet} onPress={() => {}}>
            <View style={s.sheetHeader}>
              <Text style={s.sheetTitulo}>{titulo}</Text>
              <Text style={s.sheetSub}>{temp.length} selecionado{temp.length !== 1 ? 's' : ''}</Text>
            </View>
            <FlatList
              data={itens as string[]}
              keyExtractor={c => c}
              style={s.lista}
              renderItem={({ item }) => {
                const sel = temp.includes(item)
                return (
                  <TouchableOpacity style={s.item} onPress={() => toggle(item)} activeOpacity={0.6}>
                    <Text style={[s.itemTexto, sel && s.itemTextoSel]}>{labels[item]}</Text>
                    {sel
                      ? <Ionicons name="checkmark-circle" size={20} color={Colors.accent} />
                      : <View style={s.circulo} />}
                  </TouchableOpacity>
                )
              }}
              ItemSeparatorComponent={() => <View style={s.separador} />}
            />
            <TouchableOpacity style={s.confirmar} onPress={confirmar} activeOpacity={0.8}>
              <Text style={s.confirmarTexto}>Confirmar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  )
}

// ─── Tela ─────────────────────────────────────────────────────────────────────

export default function OnboardingOficina() {
  const [nome,       setNome]       = useState('')
  const [cnpj,       setCnpj]       = useState('')
  const [telefone,   setTelefone]   = useState('')
  const [categorias, setCategorias] = useState<string[]>([])
  const [pagamentos, setPagamentos] = useState<string[]>([])
  const [cep,        setCep]        = useState('')
  const [rua,        setRua]        = useState('')
  const [numero,     setNumero]     = useState('')
  const [bairro,     setBairro]     = useState('')
  const [cidade,     setCidade]     = useState('')
  const [estado,     setEstado]     = useState('')
  const [loading,    setLoading]    = useState(false)
  const [buscando,   setBuscando]   = useState(false)
  const [erro,       setErro]       = useState('')

  const { user, signIn } = useAuth()
  const router  = useRouter()
  const insets  = useSafeAreaInsets()

  async function buscarCep() {
    const cepLimpo = cep.replace(/\D/g, '')
    if (cepLimpo.length !== 8) return
    setBuscando(true)
    try {
      const res  = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const data = await res.json()
      if (!data.erro) {
        setRua(data.logradouro)
        setBairro(data.bairro)
        setCidade(data.localidade)
        setEstado(data.uf)
      }
    } catch {} finally { setBuscando(false) }
  }

  async function handleConcluir() {
    if (!nome || categorias.length === 0 || pagamentos.length === 0 ||
        !cep || !rua || !numero || !bairro || !cidade || !estado) {
      setErro('Preencha todos os campos e selecione ao menos um nicho e uma forma de pagamento')
      return
    }
    setErro('')
    setLoading(true)
    try {
      const res = await api.post<{ accessToken: string; refreshToken: string }>('/oficina/onboarding', {
        nome,
        cnpj:            cnpj     ? cnpj.replace(/\D/g, '')     : undefined,
        telefone:        telefone ? telefone.replace(/\D/g, '') : undefined,
        categorias,
        formasPagamento: pagamentos,
        cep: cep.replace(/\D/g, ''), rua, numero, bairro, cidade, estado,
      })
      await signIn(res.accessToken, { ...user!, role: 'OFICINA' }, res.refreshToken)
    } catch (err: any) {
      setErro(err.message ?? 'Não foi possível salvar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[s.scroll, { paddingTop: insets.top + Spacing.base }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={s.voltarBtn}
          onPress={() => router.back()}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={20} color={Colors.primary} />
        </TouchableOpacity>

        <Text style={s.titulo}>Conta da{'\n'}sua empresa.</Text>
        <Text style={s.subtitulo}>Esses dados aparecem pros motoristas e ajudam você a ganhar o selo verificado.</Text>

        {/* Sobre o negócio */}
        <View style={s.secaoHeader}>
          <Ionicons name="business-outline" size={16} color={Colors.textSecondary} />
          <Text style={s.secaoTitulo}>Sobre o negócio</Text>
        </View>

        <Input
          placeholder="Nome da empresa"
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
          returnKeyType="next"
        />
        <Input
          placeholder="CNPJ (opcional)"
          value={cnpj}
          onChangeText={t => setCnpj(formatCnpj(t))}
          keyboardType="number-pad"
          returnKeyType="next"
        />
        <Input
          placeholder="Telefone (opcional)"
          value={telefone}
          onChangeText={t => setTelefone(formatCelular(t))}
          keyboardType="phone-pad"
          returnKeyType="next"
        />

        {/* Nichos */}
        <View style={s.secaoHeader}>
          <Ionicons name="construct-outline" size={16} color={Colors.textSecondary} />
          <Text style={s.secaoTitulo}>Nichos de atuação</Text>
        </View>

        <MultiDropdown
          itens={CATEGORIAS}
          labels={CATEGORIA_LABELS}
          selecionados={categorias}
          onChange={setCategorias}
          placeholder="Selecionar nichos"
          titulo="Nichos de atuação"
        />

        {/* Pagamentos */}
        <View style={s.secaoHeader}>
          <Ionicons name="card-outline" size={16} color={Colors.textSecondary} />
          <Text style={s.secaoTitulo}>Formas de pagamento</Text>
        </View>

        <MultiDropdown
          itens={PAGAMENTOS}
          labels={PAGAMENTO_LABELS}
          selecionados={pagamentos}
          onChange={setPagamentos}
          placeholder="Selecionar formas de pagamento"
          titulo="Formas de pagamento"
        />

        {/* Endereço */}
        <View style={s.secaoHeader}>
          <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
          <Text style={s.secaoTitulo}>Endereço</Text>
        </View>

        <View style={s.cepRow}>
          <View style={{ flex: 1 }}>
            <Input
              placeholder="CEP"
              value={cep}
              onChangeText={t => setCep(formatCep(t))}
              keyboardType="number-pad"
              onBlur={buscarCep}
              returnKeyType="next"
            />
          </View>
          <TouchableOpacity style={s.buscarBtn} onPress={buscarCep} disabled={buscando}>
            {buscando
              ? <ActivityIndicator size="small" color={Colors.accent} />
              : <Text style={s.buscarTexto}>Buscar</Text>}
          </TouchableOpacity>
        </View>

        <View style={s.row}>
          <View style={{ flex: 2 }}>
            <Input placeholder="Rua" value={rua} onChangeText={setRua} returnKeyType="next" />
          </View>
          <View style={{ flex: 1 }}>
            <Input placeholder="Número" value={numero} onChangeText={setNumero} keyboardType="number-pad" returnKeyType="next" />
          </View>
        </View>

        <Input
          placeholder="Bairro - Cidade"
          value={bairro && cidade ? `${bairro} - ${cidade}` : ''}
          editable={false}
        />

        {!!erro && (
          <View style={s.erroContainer}>
            <Ionicons name="alert-circle-outline" size={15} color={Colors.error} />
            <Text style={s.erro}>{erro}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[s.botao, loading && s.botaoDisabled]}
          onPress={handleConcluir}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading
            ? <ActivityIndicator size="small" color={Colors.surface} />
            : <>
                <Text style={s.botaoTexto}>Concluir</Text>
                <Ionicons name="arrow-forward" size={18} color={Colors.surface} />
              </>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const s = StyleSheet.create({
  container:           { flex: 1, backgroundColor: Colors.background },
  scroll:              { paddingHorizontal: Spacing.lg, paddingBottom: Spacing['4xl'] },
  voltarBtn:           { width: 40, height: 40, borderRadius: Radii.md, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.xl },
  titulo:              { fontSize: Typography.size['4xl'], fontWeight: Typography.weight.extrabold, color: Colors.primary, marginBottom: Spacing.xs, lineHeight: Typography.size['4xl'] * 1.15 },
  subtitulo:           { fontSize: Typography.size.md, color: Colors.textSecondary, marginBottom: Spacing.xl, lineHeight: Typography.size.md * 1.6 },
  secaoHeader:         { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginBottom: Spacing.md, marginTop: Spacing.sm },
  secaoTitulo:         { fontSize: Typography.size.sm, fontWeight: Typography.weight.semibold, color: Colors.textSecondary },
  dropdown:            { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radii.md, paddingHorizontal: Spacing.base, height: 52, backgroundColor: Colors.surface, marginBottom: Spacing.md },
  dropdownTexto:       { fontSize: Typography.size.base, color: Colors.text, flex: 1 },
  dropdownPlaceholder: { color: Colors.textMuted },
  overlay:             { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', paddingHorizontal: Spacing.lg },
  sheet:               { backgroundColor: Colors.surface, borderRadius: Radii.xl, overflow: 'hidden', maxHeight: '75%' as any },
  sheetHeader:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.base, borderBottomWidth: 1, borderBottomColor: Colors.border },
  sheetTitulo:         { fontSize: Typography.size.base, fontWeight: Typography.weight.bold, color: Colors.primary },
  sheetSub:            { fontSize: Typography.size.sm, color: Colors.textMuted },
  lista:               { flexGrow: 0 },
  item:                { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.base },
  itemTexto:           { fontSize: Typography.size.base, color: Colors.text, flex: 1 },
  itemTextoSel:        { color: Colors.primary, fontWeight: Typography.weight.semibold },
  circulo:             { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: Colors.border },
  separador:           { height: 1, backgroundColor: Colors.border, marginHorizontal: Spacing.lg },
  confirmar:           { backgroundColor: Colors.accent, margin: Spacing.base, borderRadius: Radii.full, paddingVertical: Spacing.base, alignItems: 'center' },
  confirmarTexto:      { color: Colors.surface, fontWeight: Typography.weight.bold, fontSize: Typography.size.base },
  cepRow:              { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  buscarBtn:           { height: 52, justifyContent: 'center', paddingHorizontal: Spacing.md, marginBottom: Spacing.md },
  buscarTexto:         { color: Colors.accent, fontWeight: Typography.weight.semibold, fontSize: Typography.size.md },
  row:                 { flexDirection: 'row', gap: Spacing.sm },
  erroContainer:       { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, backgroundColor: Colors.errorLight, padding: Spacing.sm, borderRadius: Radii.sm, marginBottom: Spacing.md },
  erro:                { fontSize: Typography.size.sm, color: Colors.error, flex: 1 },
  botao:               { flexDirection: 'row', backgroundColor: Colors.accent, borderRadius: Radii.full, paddingVertical: Spacing.base + 2, alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, marginTop: Spacing.base },
  botaoDisabled:       { opacity: 0.6 },
  botaoTexto:          { color: Colors.surface, fontWeight: Typography.weight.bold, fontSize: Typography.size.base },
})
