import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import SupplierPriceView from '@/components/SupplierPriceView'
import DeleteSupplierButton from '@/components/DeleteSupplierButton'

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
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <span className="inline-flex rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm">
            Detalhes do fornecedor
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">{supplier.name}</h1>
          <p className="mt-2 text-sm text-gray-500">Telefone: {supplier.phone}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/suppliers/${supplier.id}/edit`}
            className="rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Editar fornecedor
          </Link>
          <DeleteSupplierButton supplierId={supplier.id} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Dados gerais</h2>
          <div className="mt-5 space-y-4 text-sm text-gray-700">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Nome</p>
              <p className="mt-1 text-base font-semibold text-gray-900">{supplier.name}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Telefone</p>
              <p className="mt-1">{supplier.phone}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Dropshipping</p>
              <div className="mt-2">
                {supplier.dropshipping ? (
                  <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Sim</span>
                ) : (
                  <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">Não</span>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Observações</p>
              <p className="mt-1 leading-6 text-gray-600">{supplier.notes || 'Sem observações cadastradas.'}</p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-gray-900">Catálogos</h2>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {supplier.catalogs.length} link(s)
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {supplier.catalogs.length ? (
              supplier.catalogs.map((catalog) => (
                <div key={catalog.id} className="rounded-2xl border border-gray-200 bg-gray-50/80 p-4">
                  <p className="font-semibold text-gray-900">{catalog.title || 'Catálogo sem título'}</p>
                  <a
                    className="mt-2 inline-block break-all text-sm font-medium text-blue-700 underline"
                    href={catalog.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {catalog.url}
                  </a>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-500">
                Nenhum catálogo cadastrado para este fornecedor.
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Tabela de preços</h2>
            <p className="mt-1 text-sm text-gray-500">Valores cadastrados por categoria.</p>
          </div>
        </div>
        <SupplierPriceView prices={supplier.prices} />
      </section>
    </main>
  )
}
