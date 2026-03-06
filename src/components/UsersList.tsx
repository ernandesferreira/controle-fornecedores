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
    <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-sm">
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
                <td className="px-5 py-4"><span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{user.role}</span></td>
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
  )
}
