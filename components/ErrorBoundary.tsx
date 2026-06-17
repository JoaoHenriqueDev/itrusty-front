import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Colors, Spacing, Typography, Radii } from '../constants/theme'

interface Props  { children: React.ReactNode }
interface State  { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (__DEV__) console.error('[ErrorBoundary]', error.message, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={s.container}>
          <Text style={s.titulo}>Algo deu errado</Text>
          <Text style={s.subtitulo}>
            Tente novamente. Se o problema persistir, entre em contato com o suporte.
          </Text>
          <TouchableOpacity
            style={s.botao}
            onPress={() => this.setState({ hasError: false })}
            activeOpacity={0.8}
          >
            <Text style={s.botaoTexto}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      )
    }
    return this.props.children
  }
}

const s = StyleSheet.create({
  container:  { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.lg, backgroundColor: Colors.background },
  titulo:     { fontSize: Typography.size['2xl'], fontWeight: Typography.weight.extrabold, color: Colors.primary, marginBottom: Spacing.sm, textAlign: 'center' },
  subtitulo:  { fontSize: Typography.size.md, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24, marginBottom: Spacing.xl },
  botao:      { backgroundColor: Colors.accent, borderRadius: Radii.full, paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl },
  botaoTexto: { color: Colors.surface, fontWeight: Typography.weight.bold, fontSize: Typography.size.base },
})
