'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type UserRole = 'GESTOR' | 'OPERADOR'

type UserFormProps = {
  mode: 'create' | 'edit'
  initialData?: {
    id?: string
    name?: string
    email?: string
    role?: UserRole
    active?: boolean
  }
}

export default function UserForm({ mode, initialData }: UserFormProps) {
  const router = useRouter()
  const [name, setName] = useState(initialData?.name || '')
  const [email, setEmail] = useState(initialData?.email || '')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>(initialData?.role || 'OPERADOR')
  const [active, setIsActive] = useState(initialData?.active ?? true)
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
        body: JSON.stringify({ name, email, password, role, active }),
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
      <div className="rounded-xl border border-slate-200/80 bg-white/95 p-5 shadow-sm sm:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Nome</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm" required />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">E-mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm" required />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Perfil</label>
            <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm">
              <option value="GESTOR">Gestor</option>
              <option value="OPERADOR">Operador</option>
            </select>
            <p className="mt-1 text-xs text-slate-500">Operador não pode criar, editar ou excluir usuários. Gestor tem acesso total.</p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">{mode === 'create' ? 'Senha' : 'Nova senha'} {mode === 'edit' ? '(opcional)' : ''}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm" minLength={mode === 'create' ? 6 : undefined} required={mode === 'create'} />
            <span className="mt-1 block text-xs text-slate-500">{mode === 'create' ? 'A senha deve ter pelo menos 6 caracteres.' : 'Preencha apenas se quiser alterar a senha atual.'}</span>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
          <label className="flex items-start gap-3">
            <input type="checkbox" checked={active} onChange={(e) => setIsActive(e.target.checked)} className="mt-1 h-4 w-4 rounded border-gray-300" />
            <span className="text-sm text-slate-700">
              <strong>Status ativo</strong>
              <span className="block text-xs text-slate-500">Usuários inativos não conseguem fazer login.</span>
            </span>
          </label>
        </div>
      </div>

      {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button type="submit" disabled={loading} className="cta-primary w-full px-5 py-3 text-sm disabled:opacity-50 sm:w-auto">
          {loading ? 'Salvando...' : mode === 'create' ? 'Criar usuário' : 'Salvar alterações'}
        </button>
        <button type="button" onClick={() => router.push('/users')} className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 sm:w-auto">
          Cancelar
        </button>
      </div>
    </form>
  )
}
