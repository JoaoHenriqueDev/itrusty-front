import { useEffect, useState } from 'react'
import {
  View, Text, TextInput, ScrollView, StyleSheet, Image,
  TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { api } from '../../services/api'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Colors, Spacing, Typography, Radii } from '../../constants/theme'
import { useAppAlert } from '../../components/ui/AppAlert'
import { useHideTabBar } from '../../hooks/useHideTabBar'

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png':  'png',
  'image/webp': 'webp',
}

type PerfilData = {
  id: string; name: string; email: string
  phone: string | null; role: string | null; fotoUrl: string | null
}

export default function EditarPerfilMotorista() {
  useHideTabBar()
  const router  = useRouter()
  const insets  = useSafeAreaInsets()
  const { user, updateUser } = useAuth()
  const { alert } = useAppAlert()

  const [loading,       setLoading]       = useState(true)
  const [salvando,      setSalvando]      = useState(false)
  const [uploadando,    setUploadando]    = useState(false)
  const [name,          setName]          = useState('')
  const [email,         setEmail]         = useState('')
  const [phone,         setPhone]         = useState('')
  const [fotoUrl,       setFotoUrl]       = useState<string | null>(null)

  useEffect(() => {
    api.get<PerfilData>('/usuario/perfil')
      .then(res => {
        setName(res.name ?? '')
        setEmail(res.email ?? '')
        setPhone(res.phone ?? '')
        setFotoUrl(res.fotoUrl ?? null)
      })
      .catch(() => alert('Erro', 'Não foi possível carregar seus dados.'))
      .finally(() => setLoading(false))
  }, [])

  async function escolherFoto() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!perm.granted) {
      alert('Permissão necessária', 'Permita o acesso à galeria para escolher uma foto.')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    })

    if (result.canceled || !result.assets[0]) return

    const asset = result.assets[0]
    if (!asset.base64) {
      alert('Erro', 'Não foi possível ler a imagem.')
      return
    }

    const mimeType = asset.mimeType ?? 'image/jpeg'
    const ext      = ALLOWED_IMAGE_TYPES[mimeType]
    if (!ext) {
      alert('Formato inválido', 'Apenas imagens JPG, PNG ou WebP são permitidas.')
      return
    }

    setUploadando(true)
    try {
      const path = `motoristas/${user?.id ?? 'u'}/${Date.now()}.${ext}`

      const binaryStr = atob(asset.base64)
      const bytes     = new Uint8Array(binaryStr.length)
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i)
      }

      const { data, error } = await supabase.storage
        .from('oficina-fotos')
        .upload(path, bytes, { upsert: true, contentType: mimeType })

      if (error) throw new Error(error.message)

      const { data: { publicUrl } } = supabase.storage
        .from('oficina-fotos')
        .getPublicUrl(data.path)

      setFotoUrl(publicUrl)
    } catch (err: any) {
      alert('Erro', err.message ?? 'Não foi possível fazer o upload da foto.')
    } finally {
      setUploadando(false)
    }
  }

  async function salvar() {
    if (!name.trim()) { alert('Atenção', 'O nome não pode estar vazio.'); return }
    setSalvando(true)
    try {
      const res = await api.patch<{ user: PerfilData }>('/usuario/perfil', {
        name:    name.trim(),
        email:   email.trim(),
        phone:   phone.trim() || undefined,
        fotoUrl: fotoUrl ?? undefined,
      })
      updateUser({ id: res.user.id, name: res.user.name, role: user?.role ?? null })
      alert('Salvo!', 'Seus dados foram atualizados.', () => router.navigate('/(motorista)/perfil' as any))
    } catch (err: any) {
      alert('Erro', err.message ?? 'Não foi possível salvar.')
    } finally {
      setSalvando(false)
    }
  }

  if (loading) {
    return <View style={s.centralize}><ActivityIndicator size="large" color={Colors.accent} /></View>
  }

  const inicial = name.charAt(0).toUpperCase() || '?'

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[s.container, { paddingTop: insets.top }]}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.navigate('/(motorista)/perfil' as any)} hitSlop={12}>
            <Ionicons name="arrow-back" size={22} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={s.headerTitulo}>Editar perfil</Text>
          <View style={{ width: 22 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          {/* Foto */}
          <TouchableOpacity style={s.fotoWrap} onPress={escolherFoto} activeOpacity={0.8} disabled={uploadando}>
            {fotoUrl
              ? <Image source={{ uri: fotoUrl }} style={s.foto} />
              : (
                <View style={s.fotoPlaceholder}>
                  <Text style={s.fotoLetra}>{inicial}</Text>
                </View>
              )
            }
            <View style={s.fotoBadge}>
              {uploadando
                ? <ActivityIndicator size="small" color={Colors.surface} />
                : <Ionicons name="camera" size={14} color={Colors.surface} />
              }
            </View>
          </TouchableOpacity>

          <Text style={s.label}>Nome completo</Text>
          <TextInput
            style={s.input}
            value={name}
            onChangeText={setName}
            placeholder="Seu nome"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="words"
          />

          <Text style={s.label}>E-mail</Text>
          <TextInput
            style={s.input}
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            placeholderTextColor={Colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={s.label}>Celular <Text style={s.opcional}>(opcional)</Text></Text>
          <TextInput
            style={s.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="11912345678"
            placeholderTextColor={Colors.textMuted}
            keyboardType="phone-pad"
            maxLength={15}
          />
        </ScrollView>

        <View style={[s.rodape, { paddingBottom: Math.max(insets.bottom, Spacing.base) }]}>
          <TouchableOpacity style={s.voltarBtn} onPress={() => router.navigate('/(motorista)/perfil' as any)}>
            <Text style={s.voltarTexto}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.salvarBtn, salvando && { opacity: 0.6 }]} onPress={salvar} disabled={salvando}>
            {salvando
              ? <ActivityIndicator size="small" color={Colors.surface} />
              : <><Ionicons name="checkmark" size={18} color={Colors.surface} /><Text style={s.salvarTexto}>Salvar</Text></>}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const FOTO_SIZE = 88

const s = StyleSheet.create({
  container:      { flex: 1, backgroundColor: Colors.background },
  centralize:     { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.base, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerTitulo:   { fontSize: Typography.size.base, fontWeight: Typography.weight.bold, color: Colors.primary, flex: 1, textAlign: 'center' },
  scroll:         { padding: Spacing.lg, paddingBottom: Spacing.xxl, alignItems: 'center' },
  fotoWrap:       { position: 'relative', marginBottom: Spacing.xl, marginTop: Spacing.sm },
  foto:           { width: FOTO_SIZE, height: FOTO_SIZE, borderRadius: FOTO_SIZE / 2 },
  fotoPlaceholder:{ width: FOTO_SIZE, height: FOTO_SIZE, borderRadius: FOTO_SIZE / 2, backgroundColor: Colors.accent, justifyContent: 'center', alignItems: 'center' },
  fotoLetra:      { fontSize: Typography.size['3xl'], fontWeight: Typography.weight.extrabold, color: Colors.surface },
  fotoBadge:      { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: Colors.background },
  label:          { fontSize: Typography.size.sm, fontWeight: Typography.weight.bold, color: Colors.textSecondary, marginBottom: Spacing.xs, marginTop: Spacing.base, alignSelf: 'flex-start', width: '100%' },
  opcional:       { fontWeight: Typography.weight.regular, color: Colors.textMuted },
  input:          { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: Radii.md, padding: Spacing.base, fontSize: Typography.size.md, color: Colors.text, width: '100%' },
  rodape:         { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: Colors.background },
  voltarBtn:      { flex: 1, borderWidth: 1, borderColor: Colors.border, borderRadius: Radii.full, paddingVertical: Spacing.md, alignItems: 'center' },
  voltarTexto:    { fontSize: Typography.size.md, fontWeight: Typography.weight.semibold, color: Colors.text },
  salvarBtn:      { flex: 2, flexDirection: 'row', backgroundColor: Colors.accent, borderRadius: Radii.full, paddingVertical: Spacing.md, justifyContent: 'center', alignItems: 'center', gap: Spacing.sm },
  salvarTexto:    { fontSize: Typography.size.md, fontWeight: Typography.weight.bold, color: Colors.surface },
})
