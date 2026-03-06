import SupplierForm from '@/components/SupplierForm'

export default function NewSupplierPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          Novo cadastro
        </span>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">Cadastrar fornecedor</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
          Preencha os dados básicos, os links de catálogos e a tabela de preços por categoria.
        </p>
      </div>

      <SupplierForm mode="create" />
    </main>
  )
}
