'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

type SupplierItem = {
  id: string
  name: string
  phone: string
  dropshipping: boolean
  catalogs: { id: string }[]
}

type Props = {
  suppliers: SupplierItem[]
}

export default function SuppliersList({ suppliers }: Props) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'dropshipping' | 'stock'>('all')

  const filteredSuppliers = useMemo(() => {
    const normalized = search.trim().toLowerCase()

    return suppliers.filter((supplier) => {
      const matchesSearch = !normalized || supplier.name.toLowerCase().includes(normalized) || supplier.phone.toLowerCase().includes(normalized)
      const matchesFilter =
        filter === 'all' ||
        (filter === 'dropshipping' && supplier.dropshipping) ||
        (filter === 'stock' && !supplier.dropshipping)

      return matchesSearch && matchesFilter
    })
  }, [search, filter, suppliers])

  return (
    <div className="space-y-4">
      <div className="grid gap-4 rounded-3xl border border-white/70 bg-white/90 p-4 shadow-sm md:grid-cols-[1fr_240px]">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Buscar fornecedor</label>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nome ou telefone" className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Filtro</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value as 'all' | 'dropshipping' | 'stock')} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm">
            <option value="all">Todos</option>
            <option value="dropshipping">Apenas dropshipping</option>
            <option value="stock">Apenas estoque próprio</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-gray-50/90 text-left text-gray-600">
              <tr>
                <th className="px-5 py-4 font-semibold">Nome</th>
                <th className="px-5 py-4 font-semibold">Telefone</th>
                <th className="px-5 py-4 font-semibold">Dropshipping</th>
                <th className="px-5 py-4 font-semibold">Catálogos</th>
                <th className="px-5 py-4 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier.id} className="border-t border-gray-100 hover:bg-gray-50/70">
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{supplier.name}</p>
                      <p className="text-xs text-gray-500">ID: {supplier.id.slice(0, 8)}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-700">{supplier.phone}</td>
                  <td className="px-5 py-4">
                    {supplier.dropshipping ? (
                      <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Sim</span>
                    ) : (
                      <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">Não</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{supplier.catalogs.length} link(s)</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/suppliers/${supplier.id}`} className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50">Ver detalhes</Link>
                      <Link href={`/suppliers/${supplier.id}/edit`} className="rounded-xl bg-gray-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-gray-800">Editar</Link>
                    </div>
                  </td>
                </tr>
              ))}

              {!filteredSuppliers.length && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <p className="text-base font-semibold text-gray-900">Nenhum fornecedor encontrado</p>
                    <p className="mt-1 text-sm text-gray-500">Tente outro nome, telefone ou filtro.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
