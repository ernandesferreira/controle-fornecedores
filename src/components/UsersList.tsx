import Link from 'next/link'
import DeleteUserButton from '@/components/DeleteUserButton'

type UserItem = {
  id: string
  name: string
  email: string
  role: string
  active: boolean
  createdAt: Date
}

type Props = {
  users: UserItem[]
}

export default function UsersList({ users }: Props) {
  return (
    <div className="space-y-3">
      <div className="space-y-3 md:hidden">
        {users.map((user) => (
          <article key={user.id} className="rounded-xl border border-slate-200/80 bg-white/95 p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-bold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">Criado em {new Intl.DateTimeFormat('pt-BR').format(new Date(user.createdAt))}</p>
              </div>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${user.role === 'GESTOR' ? 'bg-violet-50 text-violet-700' : 'bg-sky-50 text-sky-700'}`}>
                {user.role === 'GESTOR' ? 'Gestor' : 'Operador'}
              </span>
            </div>

            <p className="mt-2 break-all text-sm text-slate-700">{user.email}</p>

            <div className="mt-3">
              {user.active ? (
                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Ativo</span>
              ) : (
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Inativo</span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={`/users/${user.id}/edit`} className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800">Editar</Link>
              <DeleteUserButton userId={user.id} userName={user.name} />
            </div>
          </article>
        ))}

        {!users.length && (
          <div className="rounded-xl border border-slate-200/80 bg-white/95 px-6 py-12 text-center text-slate-500 shadow-sm">Nenhum usuário cadastrado.</div>
        )}
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-slate-200/80 bg-white/95 shadow-sm md:block">
        <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-gray-50/90 text-left text-gray-600">
            <tr>
              <th className="px-5 py-4 font-semibold">Nome</th>
              <th className="px-5 py-4 font-semibold">E-mail</th>
              <th className="px-5 py-4 font-semibold">Perfil</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4 font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-gray-100 hover:bg-gray-50/70">
                <td className="px-5 py-4">
                  <div>
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">Criado em {new Intl.DateTimeFormat('pt-BR').format(new Date(user.createdAt))}</p>
                  </div>
                </td>
                <td className="px-5 py-4 text-gray-700">{user.email}</td>
                <td className="px-5 py-4"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${user.role === 'GESTOR' ? 'bg-violet-50 text-violet-700' : 'bg-sky-50 text-sky-700'}`}>{user.role === 'GESTOR' ? 'Gestor' : 'Operador'}</span></td>
                <td className="px-5 py-4">
                  {user.active ? (
                    <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Ativo</span>
                  ) : (
                    <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">Inativo</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/users/${user.id}/edit`} className="rounded-xl bg-gray-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-gray-800">Editar</Link>
                    <DeleteUserButton userId={user.id} userName={user.name} />
                  </div>
                </td>
              </tr>
            ))}

            {!users.length && (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-gray-500">Nenhum usuário cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}
