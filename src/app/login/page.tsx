import Link from 'next/link'
import { userCount } from '@/lib/auth'
import LoginForm from '@/components/LoginForm'

export default async function LoginPage() {
  const totalUsers = await userCount()

  return (
    <main className="login-screen mx-auto flex min-h-[calc(100vh-88px)] max-w-6xl items-center overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage: "url('/backgrounds/login-financeiro-serie-a.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/80 via-white/65 to-emerald-100/55" aria-hidden="true" />

      <div className="relative grid w-full gap-8 lg:grid-cols-[1.1fr_460px]">
        <section className="rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-sm sm:p-8">
          <span className="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
            Portal web de acesso
          </span>
          <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Entre para gerenciar fornecedores, preços e usuários.</h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
            A autenticação libera os módulos do ERP e mantém o controle da operação com segurança e rastreabilidade.
          </p>
          <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Acesso protegido</p>
            <p className="mt-1 text-sm text-blue-900">Somente usuários ativos com perfil autorizado podem utilizar o sistema.</p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white/95 p-8 shadow-sm">
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
