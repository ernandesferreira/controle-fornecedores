import { prisma } from '@/lib/prisma'
import { formatBRL } from '@/lib/currency'

const categories = [
  ['currentModel', 'Modelo atual'],
  ['retroModel', 'Modelo retrô'],
  ['kidsModel', 'Modelo infantil'],
  ['nflModel', 'Modelo NFL'],
  ['nbaModel', 'Modelo NBA'],
  ['customModel', 'Modelo personalizado'],
  ['patchPrice', 'Valor do patch'],
  ['longSleeve', 'Manga longa'],
  ['tracksuit', 'Agasalho'],
  ['fanVersion', 'Torcedor'],
  ['playerVersion', 'Jogador'],
] as const

type CategoryField = (typeof categories)[number][0]

function getNumericValues(values: Array<number | null | undefined>) {
  return values.filter((value): value is number => typeof value === 'number')
}

function getAverageOfLowestThree(values: number[]) {
  if (!values.length) return null

  const lowestThree = [...values].sort((a, b) => a - b).slice(0, 3)
  const total = lowestThree.reduce((sum, value) => sum + value, 0)

  return total / lowestThree.length
}

export default async function CompareSuppliersPage() {
  const suppliers = await prisma.supplier.findMany({
    include: { prices: true },
    orderBy: { name: 'asc' },
  })

  const categoryStats = Object.fromEntries(
    categories.map(([field]) => {
      const values = getNumericValues(suppliers.map((supplier) => supplier.prices?.[field]))
      const lowest = values.length ? Math.min(...values) : null
      const averageOfLowestThree = getAverageOfLowestThree(values)

      return [field, { lowest, averageOfLowestThree }]
    })
  ) as Record<CategoryField, { lowest: number | null; averageOfLowestThree: number | null }>

  return (
    <main className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          Comparativo de preços
        </span>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">Comparar fornecedores</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
          Os menores valores de cada categoria ficam destacados em verde. A última linha mostra o preço médio calculado com os 3 menores valores de cada categoria.
        </p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-white/70 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Fornecedores cadastrados</p>
          <p className="mt-2 text-3xl font-black text-gray-900">{suppliers.length}</p>
        </div>
        <div className="rounded-3xl border border-white/70 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Categorias comparadas</p>
          <p className="mt-2 text-3xl font-black text-gray-900">{categories.length}</p>
        </div>
        <div className="rounded-3xl border border-white/70 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Regra do preço médio</p>
          <p className="mt-2 text-sm font-semibold text-gray-900">Média dos 3 menores valores</p>
          <p className="mt-1 text-xs leading-5 text-gray-500">Quando houver menos de 3 preços válidos, a média usa apenas os valores disponíveis.</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-gray-50/90 text-left">
              <tr>
                <th className="sticky left-0 z-10 bg-gray-50 px-5 py-4 font-semibold text-gray-700">Fornecedor</th>
                {categories.map(([, label]) => (
                  <th key={label} className="px-5 py-4 whitespace-nowrap font-semibold text-gray-700">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="border-t border-gray-100 align-top hover:bg-gray-50/60">
                  <td className="sticky left-0 bg-white px-5 py-4 font-semibold whitespace-nowrap text-gray-900">
                    {supplier.name}
                  </td>
                  {categories.map(([field]) => {
                    const value = supplier.prices?.[field] ?? null
                    const isLowest = value !== null && value === categoryStats[field].lowest

                    return (
                      <td
                        key={field}
                        className={`px-5 py-4 whitespace-nowrap ${
                          isLowest ? 'bg-green-50 font-bold text-green-700' : 'text-gray-700'
                        }`}
                      >
                        {formatBRL(value)}
                      </td>
                    )
                  })}
                </tr>
              ))}

              {!!suppliers.length && (
                <tr className="border-t-2 border-blue-100 bg-blue-50/60 align-top">
                  <td className="sticky left-0 bg-blue-50 px-5 py-4 font-bold whitespace-nowrap text-blue-900">
                    Preço médio (3 menores)
                  </td>
                  {categories.map(([field]) => (
                    <td key={field} className="px-5 py-4 font-bold whitespace-nowrap text-blue-900">
                      {formatBRL(categoryStats[field].averageOfLowestThree)}
                    </td>
                  ))}
                </tr>
              )}

              {!suppliers.length && (
                <tr>
                  <td colSpan={12} className="px-4 py-14 text-center text-gray-500">
                    Nenhum fornecedor cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
