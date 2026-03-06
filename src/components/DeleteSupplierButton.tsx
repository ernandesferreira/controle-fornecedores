'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Props = {
  supplierId: string
}

export default function DeleteSupplierButton({ supplierId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    const confirmed = window.confirm('Deseja realmente excluir este fornecedor?')
    if (!confirmed) return

    setLoading(true)

    try {
      const response = await fetch(`/api/suppliers/${supplierId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir fornecedor')
      }

      router.push('/suppliers')
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Não foi possível excluir o fornecedor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
    >
      {loading ? 'Excluindo...' : 'Excluir fornecedor'}
    </button>
  )
}
