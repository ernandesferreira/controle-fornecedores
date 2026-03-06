'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type UserFormProps = {
  mode: 'create' | 'edit'
  initialData?: {
    id?: string
    name?: string
    email?: string
    active?: boolean
  }
}

export default function UserForm({ mode, initialData }: UserFormProps) {
  const router = useRouter()
  const [name, setName] = useState(initialData?.name || '')
  const [email, setEmail] = useState(initialData?.email || '')
  const [password, setPassword] = useState('')
  const [active, setactive] = useState(initialData?.active ?? true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = mode === 'create' ? '/api/users' : `/api/users/${initialData?.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, active }),
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Não foi possível salvar o usuário.')
        return
      }

      router.push('/users')
      router.refresh()
    } catch {
      setError('Erro inesperado ao salvar o usuário.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Nome</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm" required />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">E-mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm" required />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              {mode === 'create' ? 'Senha' : 'Nova senha (opcional)'}
            </label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm" minLength={mode === 'create' ? 6 : undefined} placeholder={mode === 'create' ? 'Mínimo 6 caracteres' : 'Preencha somente se quiser trocar'} required={mode === 'create'} />
          </div>
          <div className="md:col-span-2 rounded-2xl border border-gray-200 bg-gray-50/80 p-4">
            <label className="flex cursor-pointer items-center gap-3">
              <input type="checkbox" checked={active} onChange={(e) => setactive(e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
              <span>
                <span className="block text-sm font-semibold text-gray-800">Usuário ativo</span>
                <span className="block text-xs text-gray-500">Usuários inativos não conseguem fazer login.</span>
              </span>
            </label>
          </div>
        </div>
      </div>

      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={loading} className="rounded-2xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
          {loading ? 'Salvando...' : mode === 'create' ? 'Criar usuário' : 'Salvar alterações'}
        </button>
        <button type="button" onClick={() => router.push('/users')} className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700">
          Cancelar
        </button>
      </div>
    </form>
  )
}
