import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { requireManagerUser } from '@/lib/auth'
import UserForm from '@/components/UserForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditUserPage({ params }: PageProps) {
  await requireManagerUser()
  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
    },
  })

  if (!user) return notFound()

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-sm sm:p-6">
        <span className="inline-flex rounded-lg border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          Editar acesso
        </span>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">Editar usuário</h1>
        <p className="mt-2 text-sm text-slate-600">Atualize dados de acesso, perfil, status e senha.</p>
      </div>

      <UserForm
        mode="edit"
        initialData={{
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          active: user.active,
        }}
      />
    </main>
  )
}
