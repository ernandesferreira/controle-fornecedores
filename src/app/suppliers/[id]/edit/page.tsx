import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import SupplierForm from '@/components/SupplierForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditSupplierPage({ params }: PageProps) {
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
      <div className="mb-8">
        <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          Editar cadastro
        </span>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">Editar fornecedor</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">Atualize dados gerais, links de catálogo e preços.</p>
      </div>

      <SupplierForm
        mode="edit"
        initialData={{
          id: supplier.id,
          name: supplier.name,
          phone: supplier.phone,
          notes: supplier.notes,
          dropshipping: supplier.dropshipping,
          catalogs: supplier.catalogs.map((item) => ({
            title: item.title || '',
            url: item.url,
          })),
          prices: {
            currentModel: supplier.prices?.currentModel,
            retroModel: supplier.prices?.retroModel,
            kidsModel: supplier.prices?.kidsModel,
            nflModel: supplier.prices?.nflModel,
            nbaModel: supplier.prices?.nbaModel,
            customModel: supplier.prices?.customModel,
            patchPrice: supplier.prices?.patchPrice,
            longSleeve: supplier.prices?.longSleeve,
            tracksuit: supplier.prices?.tracksuit,
            fanVersion: supplier.prices?.fanVersion,
            playerVersion: supplier.prices?.playerVersion,
          },
        }}
      />
    </main>
  )
}
