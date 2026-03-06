import { redirect } from 'next/navigation'
import { userCount } from '@/lib/auth'
import SetupForm from '@/components/SetupForm'

export default async function SetupPage() {
  const totalUsers = await userCount()
  if (totalUsers > 0) redirect('/login')

  return (
    <main className="mx-auto flex min-h-[calc(100vh-88px)] max-w-5xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_460px]">
        <section className="rounded-[2rem] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-8 text-white shadow-xl">
          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/80">
            Setup inicial
          </span>
          <h1 className="mt-6 text-4xl font-black tracking-tight">Crie o primeiro usuário gestor do sistema.</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/70">
            Esse usuário terá acesso ao painel, ao cadastro de fornecedores e ao gerenciamento de outros usuários.
          </p>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-sm">
          <h2 className="text-2xl font-black text-gray-900">Primeiro acesso</h2>
          <p className="mt-2 text-sm text-gray-500">Defina o gestor principal para começar a usar o sistema.</p>
          <div className="mt-6">
            <SetupForm />
          </div>
        </section>
      </div>
    </main>
  )
}
