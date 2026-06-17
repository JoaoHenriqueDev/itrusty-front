import { useEffect, useState } from 'react'
import { api } from '../services/api'

type Notificacao = {
  id: string
  titulo: string
  corpo: string
  lida: boolean
  criadaEm: string
}

// Singleton module-level — apenas 1 interval independente de quantos componentes usam o hook
let _notificacoes: Notificacao[] = []
let _setters: Set<React.Dispatch<React.SetStateAction<Notificacao[]>>> = new Set()
let _intervalId: ReturnType<typeof setInterval> | null = null

export function resetarNotificacoes() {
  _notificacoes = []
  _setters.forEach(s => s([]))
}

async function _carregar() {
  try {
    const res = await api.get<{ notificacoes: Notificacao[] }>('/notificacoes')
    _notificacoes = res.notificacoes
    _setters.forEach(s => s([..._notificacoes]))
  } catch (err) {
    if (__DEV__) console.warn('useNotificacoes:', err)
  }
}

export function useNotificacoes() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(_notificacoes)

  useEffect(() => {
    _setters.add(setNotificacoes)

    if (_setters.size === 1) {
      // Primeiro consumidor — inicia o polling
      _carregar()
      _intervalId = setInterval(_carregar, 30_000)
    } else {
      // Demais consumidores — sincroniza o estado atual sem nova requisição
      setNotificacoes([..._notificacoes])
    }

    return () => {
      _setters.delete(setNotificacoes)
      if (_setters.size === 0 && _intervalId) {
        clearInterval(_intervalId)
        _intervalId = null
      }
    }
  }, [])

  async function marcarLida(id: string) {
    try {
      await api.patch(`/notificacoes/${id}/lida`, {})
      const nova = _notificacoes.filter(n => n.id !== id)
      _notificacoes = nova
      _setters.forEach(s => s([...nova]))
    } catch (err) {
      if (__DEV__) console.warn('useNotificacoes.marcarLida:', err)
    }
  }

  return { notificacoes, naoLidas: notificacoes.length, marcarLida, recarregar: _carregar }
}
