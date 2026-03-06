import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { requireCurrentUser } from '@/lib/auth'
import UserForm from '@/components/UserForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditUserPage({ params }: PageProps) {
  await requireCurrentUser()
  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      active: true,
    },
  })

  if (!user) return notFound()

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight text-gray-900">Editar usuário</h1>
        <p className="mt-2 text-sm text-gray-600">Atualize dados de acesso, status e senha.</p>
      </div>

      <UserForm
        mode="edit"
        initialData={{
          id: user.id,
          name: user.name,
          email: user.email,
          active: user.active,
        }}
      />
    </main>
  )
}
