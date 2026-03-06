'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SetupForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Não foi possível concluir o setup.')
        return
      }

      router.push('/suppliers')
      router.refresh()
    } catch {
      setError('Erro inesperado ao concluir setup.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Nome do gestor</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm" required />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-700">E-mail</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm" required />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Senha</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm" minLength={6} required />
      </div>

      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <button type="submit" disabled={loading} className="w-full rounded-2xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
        {loading ? 'Criando acesso...' : 'Criar primeiro acesso'}
      </button>
    </form>
  )
}
