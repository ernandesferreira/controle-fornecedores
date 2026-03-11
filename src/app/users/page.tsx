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
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
              Módulo ERP: usuários e acesso
            </span>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">Usuários do sistema</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              Crie acessos por perfil, acompanhe status ativo e mantenha a governança do sistema centralizada.
            </p>
          </div>

          <Link href="/users/new" className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
            + Novo usuário
          </Link>
        </div>
      </div>

      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200/80 bg-white/95 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Total de usuários</p>
          <p className="mt-2 text-3xl font-black text-gray-900">{users.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white/95 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Ativos</p>
          <p className="mt-2 text-3xl font-black text-gray-900">{users.filter((item) => item.active).length}</p>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white/95 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Inativos</p>
          <p className="mt-2 text-3xl font-black text-gray-900">{users.filter((item) => !item.active).length}</p>
        </div>
      </div>

      <UsersList users={users} />
    </main>
  )
}
