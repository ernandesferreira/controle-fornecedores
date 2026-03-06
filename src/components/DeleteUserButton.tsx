
'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Props = {
  userId: string
}

export default function DeleteUserButton({ userId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    const confirmed = window.confirm('Deseja realmente excluir este usuário?')
    if (!confirmed) return

    setLoading(true)

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao excluir usuário.')
      }

      router.push('/users')
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Erro ao excluir usuário')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="rounded-xl border border-red-300 px-4 py-3 text-red-600 disabled:opacity-50"
    >
      {loading ? 'Excluindo...' : 'Excluir usuário'}
    </button>
  )
}
