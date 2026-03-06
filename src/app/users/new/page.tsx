import { requireManagerUser } from '@/lib/auth'
import UserForm from '@/components/UserForm'

export default async function NewUserPage() {
  await requireManagerUser()

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight text-gray-900">Novo usuário</h1>
        <p className="mt-2 text-sm text-gray-600">Crie um novo acesso com perfil Gestor ou Operador.</p>
      </div>

      <UserForm mode="create" />
    </main>
  )
}
