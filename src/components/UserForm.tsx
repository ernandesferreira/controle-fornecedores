
'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type UserFormProps = {
  mode: 'create' | 'edit'
  initialData?: {
    id: string
    name: string
    email: string
    role: 'GESTOR' | 'OPERADOR'
    active: boolean
  }
}

export default function UserForm({ mode, initialData }: UserFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState(initialData?.name || '')
  const [email, setEmail] = useState(initialData?.email || '')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'GESTOR' | 'OPERADOR'>(initialData?.role || 'OPERADOR')
  const [active, setActive] = useState(initialData?.active ?? true)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const endpoint = mode === 'create' ? '/api/users' : `/api/users/${initialData?.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          active,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao salvar usuário')
      }

      router.push('/users')
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Erro ao salvar usuário')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border bg-white p-6">
      <div className="grid gap-4 md:grid-cols-2">

        <div>
          <label className="mb-1 block text-sm font-medium">Nome</label>
          <input
            className="w-full rounded-xl border px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full rounded-xl border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Senha {mode === 'edit' ? '(preencha apenas se quiser alterar)' : ''}
          </label>
          <input
            type="password"
            className="w-full rounded-xl border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={mode === 'create'}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Perfil</label>
          <select
            className="w-full rounded-xl border px-3 py-2"
            value={role}
            onChange={(e) => setRole(e.target.value as 'GESTOR' | 'OPERADOR')}
          >
            <option value="GESTOR">Gestor</option>
            <option value="OPERADOR">Operador</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="active"
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
        />
        <label htmlFor="active" className="text-sm font-medium">
          Usuário ativo
        </label>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-black px-5 py-3 text-white disabled:opacity-50"
        >
          {loading ? 'Salvando...' : mode === 'create' ? 'Criar usuário' : 'Salvar alterações'}
        </button>

        <button
          type="button"
          onClick={() => router.push('/users')}
          className="rounded-xl border px-5 py-3"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
