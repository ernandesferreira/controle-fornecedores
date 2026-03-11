import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import SupplierPriceView from '@/components/SupplierPriceView'
import DeleteSupplierButton from '@/components/DeleteSupplierButton'
import CatalogViewer from '@/components/CatalogViewer'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function SupplierDetailsPage({ params }: PageProps) {
  const { id } = await params

  const supplier = await prisma.supplier.findUnique({
    where: { id },
    include: {
      catalogs: true,
      prices: true,
    },
  })

  if (!supplier) return notFound()

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="reveal-up mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-sm sm:p-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <span className="inline-flex rounded-lg border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">
            Detalhes do fornecedor
          </span>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">{supplier.name}</h1>
          <p className="mt-2 text-sm text-slate-500">Telefone: {supplier.phone}</p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
          <Link
            href={`/suppliers/${supplier.id}/edit`}
            className="cta-primary w-full px-4 py-3 text-center text-sm sm:w-auto"
          >
            Editar fornecedor
          </Link>
          <DeleteSupplierButton supplierId={supplier.id} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="reveal-up stagger-1 rounded-xl border border-slate-200/80 bg-white/95 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Dados gerais</h2>
          <div className="mt-5 space-y-4 text-sm text-slate-700">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Nome</p>
              <p className="mt-1 text-base font-semibold text-slate-900">{supplier.name}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Telefone</p>
              <p className="mt-1">{supplier.phone}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Dropshipping</p>
              <div className="mt-2">
                {supplier.dropshipping ? (
                  <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Sim</span>
                ) : (
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Não</span>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Observações</p>
              <p className="mt-1 leading-6 text-slate-600">{supplier.notes || 'Sem observações cadastradas.'}</p>
            </div>
          </div>
        </section>

        <section className="reveal-up stagger-2 rounded-xl border border-slate-200/80 bg-white/95 p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Tabela de preços</h2>
              <p className="mt-1 text-sm text-slate-500">Valores cadastrados por categoria.</p>
            </div>
          </div>
          <SupplierPriceView prices={supplier.prices} />
        </section>
      </div>

      <section className="reveal-up stagger-3 mt-6 rounded-xl border border-slate-200/80 bg-white/95 p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Catálogos</h2>
            <p className="mt-1 text-sm text-slate-500">
              {supplier.catalogs.length
                ? `${supplier.catalogs.length} catálogo(s) cadastrado(s)`
                : 'Nenhum catálogo cadastrado'}
            </p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {supplier.catalogs.length} link(s)
          </span>
        </div>
        <CatalogViewer catalogs={supplier.catalogs} />
      </section>
    </main>
  )
}
