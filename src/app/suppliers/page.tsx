import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import SuppliersList from '@/components/SuppliersList'

export default async function SuppliersPage() {
  const suppliers = await prisma.supplier.findMany({
    include: {
      catalogs: true,
      prices: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="inline-flex rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm">
            Gestão de fornecedores
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">Fornecedores cadastrados</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
            Cadastre novos fornecedores, edite informações e acompanhe rapidamente a quantidade de catálogos de cada um.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/suppliers/compare"
            className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
          >
            Comparar fornecedores
          </Link>
          <Link
            href="/suppliers/new"
            className="rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            + Novo fornecedor
          </Link>
        </div>
      </div>

      <div className="mb-5 grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total de fornecedores</p>
          <p className="mt-2 text-3xl font-black text-gray-900">{suppliers.length}</p>
        </div>
        <div className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Com catálogo</p>
          <p className="mt-2 text-3xl font-black text-gray-900">{suppliers.filter((item) => item.catalogs.length > 0).length}</p>
        </div>
        <div className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Prontos para comparação</p>
          <p className="mt-2 text-3xl font-black text-gray-900">{suppliers.filter((item) => item.prices).length}</p>
        </div>
        <div className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Dropshipping</p>
          <p className="mt-2 text-3xl font-black text-gray-900">{suppliers.filter((item) => item.dropshipping).length}</p>
        </div>
      </div>

      <SuppliersList suppliers={suppliers} />
    </main>
  )
}
