import Link from 'next/link'
import { userCount } from '@/lib/auth'
import LoginForm from '@/components/LoginForm'

export default async function LoginPage() {
  const totalUsers = await userCount()

  return (
    <main className="mx-auto flex min-h-[calc(100vh-88px)] max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_460px]">
        <section className="rounded-[2rem] bg-gray-900 p-8 text-white shadow-xl">
          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/80">
            Acesso do gestor
          </span>
          <h1 className="mt-6 text-4xl font-black tracking-tight">Entre para gerenciar fornecedores, preços e usuários.</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/70">
            Proteja o painel com login e mantenha o controle centralizado da operação. A partir daqui você gerencia fornecedores, comparativos e também os usuários com acesso ao sistema.
          </p>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-sm">
          <h2 className="text-2xl font-black text-gray-900">Entrar no sistema</h2>
          <p className="mt-2 text-sm text-gray-500">Use seu e-mail e senha de acesso ao gestor.</p>
          <div className="mt-6">
            <LoginForm />
          </div>
          {totalUsers === 0 ? (
            <p className="mt-5 text-sm text-gray-600">
              Ainda não existe usuário cadastrado. <Link href="/setup" className="font-semibold text-blue-700 underline">Criar primeiro acesso</Link>
            </p>
          ) : null}
        </section>
      </div>
    </main>
  )
}
