import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { requireManagerUser } from '@/lib/auth'
import UsersList from '@/components/UsersList'

export default async function UsersPage() {
  await requireManagerUser()

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
    },
  })

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="inline-flex rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm">
            Controle de acesso
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">Usuários do sistema</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
            Crie acessos com perfil Gestor ou Operador, edite permissões e mantenha o controle centralizado de quem pode usar o sistema.
          </p>
        </div>

        <Link href="/users/new" className="rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800">
          + Novo usuário
        </Link>
      </div>

      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total de usuários</p>
          <p className="mt-2 text-3xl font-black text-gray-900">{users.length}</p>
        </div>
        <div className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Ativos</p>
          <p className="mt-2 text-3xl font-black text-gray-900">{users.filter((item) => item.active).length}</p>
        </div>
        <div className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Inativos</p>
          <p className="mt-2 text-3xl font-black text-gray-900">{users.filter((item) => !item.active).length}</p>
        </div>
      </div>

      <UsersList users={users} />
    </main>
  )
}
