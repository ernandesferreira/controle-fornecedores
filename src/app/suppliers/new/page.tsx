import SupplierForm from '@/components/SupplierForm'

export default function NewSupplierPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-sm sm:p-6">
        <span className="inline-flex rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          Novo cadastro
        </span>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Cadastrar fornecedor</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Preencha os dados básicos, os links de catálogos e a tabela de preços por categoria.
        </p>
      </div>

      <SupplierForm mode="create" />
    </main>
  )
}
