import { requireManagerUser } from '@/lib/auth'
import UserForm from '@/components/UserForm'

export default async function NewUserPage() {
  await requireManagerUser()

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-sm sm:p-6">
        <span className="inline-flex rounded-lg border border-sky-300 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
          Novo acesso
        </span>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">Novo usuário</h1>
        <p className="mt-2 text-sm text-slate-600">Crie um novo acesso com perfil Gestor ou Operador.</p>
      </div>

      <UserForm mode="create" />
    </main>
  )
}
