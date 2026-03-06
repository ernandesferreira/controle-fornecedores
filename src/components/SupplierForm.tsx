'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type CatalogItem = {
  title: string
  url: string
}

type PriceFields = {
  currentModel: string
  retroModel: string
  kidsModel: string
  nflModel: string
  nbaModel: string
  customModel: string
  patchPrice: string
  longSleeve: string
  tracksuit: string
  fanVersion: string
  playerVersion: string
}

type SupplierFormProps = {
  initialData?: {
    id?: string
    name?: string
    phone?: string
    notes?: string | null
    dropshipping?: boolean
    catalogs?: CatalogItem[]
    prices?: Partial<Record<keyof PriceFields, number | string | null>>
  }
  mode: 'create' | 'edit'
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)

  if (digits.length <= 10) {
    return digits
      .replace(/(\d{0,2})(\d{0,4})(\d{0,4})/, (_, a, b, c) => {
        let result = ''
        if (a) result += `(${a}`
        if (a.length === 2) result += ') '
        if (b) result += b
        if (c) result += `-${c}`
        return result
      })
      .trim()
  }

  return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
}

export default function SupplierForm({ initialData, mode }: SupplierFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(initialData?.name || '')
  const [phone, setPhone] = useState(initialData?.phone || '')
  const [notes, setNotes] = useState(initialData?.notes || '')
  const [dropshipping, setDropshipping] = useState(initialData?.dropshipping ?? false)
  const [catalogs, setCatalogs] = useState<CatalogItem[]>(
    initialData?.catalogs?.length ? initialData.catalogs : [{ title: '', url: '' }]
  )
  const [prices, setPrices] = useState<PriceFields>({
    currentModel: String(initialData?.prices?.currentModel ?? ''),
    retroModel: String(initialData?.prices?.retroModel ?? ''),
    kidsModel: String(initialData?.prices?.kidsModel ?? ''),
    nflModel: String(initialData?.prices?.nflModel ?? ''),
    nbaModel: String(initialData?.prices?.nbaModel ?? ''),
    customModel: String(initialData?.prices?.customModel ?? ''),
    patchPrice: String(initialData?.prices?.patchPrice ?? ''),
    longSleeve: String(initialData?.prices?.longSleeve ?? ''),
    tracksuit: String(initialData?.prices?.tracksuit ?? ''),
    fanVersion: String(initialData?.prices?.fanVersion ?? ''),
    playerVersion: String(initialData?.prices?.playerVersion ?? ''),
  })

  function updateCatalog(index: number, field: keyof CatalogItem, value: string) {
    setCatalogs((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  function addCatalog() {
    setCatalogs((prev) => [...prev, { title: '', url: '' }])
  }

  function removeCatalog(index: number) {
    setCatalogs((prev) => prev.filter((_, i) => i !== index))
  }

  function updatePrice(field: keyof PriceFields, value: string) {
    setPrices((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        name,
        phone,
        notes,
        dropshipping,
        catalogs,
        prices,
      }

      const endpoint = mode === 'create' ? '/api/suppliers' : `/api/suppliers/${initialData?.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Falha ao salvar fornecedor.')

      router.push('/suppliers')
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Não foi possível salvar o fornecedor.')
    } finally {
      setLoading(false)
    }
  }

  const priceInputs: Array<{ field: keyof PriceFields; label: string }> = [
    { field: 'currentModel', label: 'Modelo atual' },
    { field: 'retroModel', label: 'Modelo retrô' },
    { field: 'kidsModel', label: 'Modelo infantil' },
    { field: 'nflModel', label: 'Modelo NFL' },
    { field: 'nbaModel', label: 'Modelo NBA' },
    { field: 'customModel', label: 'Modelo personalizado' },
    { field: 'patchPrice', label: 'Valor do patch' },
    { field: 'longSleeve', label: 'Manga longa' },
    { field: 'tracksuit', label: 'Agasalho' },
    { field: 'fanVersion', label: 'Torcedor' },
    { field: 'playerVersion', label: 'Jogador' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-4 rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-sm md:grid-cols-2">
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold text-gray-900">Dados do fornecedor</h2>
          <p className="mt-1 text-sm text-gray-500">Cadastre as informações principais e defina se o fornecedor atende em dropshipping.</p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Nome</label>
          <input className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Telefone</label>
          <input className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} required />
        </div>

        <div className="md:col-span-2 rounded-2xl border border-gray-200 bg-gray-50/80 p-4">
          <label className="flex cursor-pointer items-center gap-3">
            <input type="checkbox" checked={dropshipping} onChange={(e) => setDropshipping(e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
            <span>
              <span className="block text-sm font-semibold text-gray-800">Fornecedor faz dropshipping</span>
              <span className="block text-xs text-gray-500">Ative esta opção para identificar fornecedores que enviam direto ao cliente.</span>
            </span>
          </label>
        </div>

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">Observações</label>
          <textarea className="min-h-28 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
      </div>

      <div className="space-y-4 rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Links de catálogos</h2>
            <p className="mt-1 text-sm text-gray-500">Você pode adicionar um ou vários links por fornecedor.</p>
          </div>
          <button type="button" onClick={addCatalog} className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700">+ Adicionar link</button>
        </div>

        {catalogs.map((catalog, index) => (
          <div key={index} className="grid gap-3 rounded-2xl border border-gray-200 bg-gray-50/70 p-4 md:grid-cols-[1fr_2fr_auto]">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">Título</label>
              <input className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm" value={catalog.title} onChange={(e) => updateCatalog(index, 'title', e.target.value)} placeholder="Ex: Catálogo principal" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">URL</label>
              <input className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm" value={catalog.url} onChange={(e) => updateCatalog(index, 'url', e.target.value)} placeholder="https://..." />
            </div>
            <div className="flex items-end">
              <button type="button" onClick={() => removeCatalog(index)} className="rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600">Remover</button>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">Tabela de preços</h2>
          <p className="mt-1 text-sm text-gray-500">Informe os valores por categoria para comparação futura.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {priceInputs.map(({ field, label }) => (
            <div key={field}>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">{label}</label>
              <input type="number" step="0.01" min="0" className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm" value={prices[field]} onChange={(e) => updatePrice(field, e.target.value)} placeholder="0.00" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={loading} className="rounded-2xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
          {loading ? 'Salvando...' : mode === 'create' ? 'Cadastrar fornecedor' : 'Salvar alterações'}
        </button>
        <button type="button" onClick={() => router.push('/suppliers')} className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700">Cancelar</button>
      </div>
    </form>
  )
}
