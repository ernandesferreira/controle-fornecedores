'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Props = {
  userId: string
  userName: string
}

export default function DeleteUserButton({ userId, userName }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    const confirmed = window.confirm(`Deseja realmente excluir o usuário ${userName}?`)
    if (!confirmed) return

    setLoading(true)
    try {
      const response = await fetch(`/api/users/${userId}`, { method: 'DELETE' })
      const data = await response.json()
      if (!response.ok) {
        alert(data.error || 'Não foi possível excluir o usuário.')
        return
      }
      router.refresh()
    } catch {
      alert('Erro inesperado ao excluir o usuário.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button type="button" onClick={handleDelete} disabled={loading} className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50">
      {loading ? 'Excluindo...' : 'Excluir'}
    </button>
  )
}
