import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'

export default async function HomePage() {
  const user = await getCurrentUser()

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2rem] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-8 text-white shadow-xl sm:p-10">
          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/80">
            Painel do gestor
          </span>
          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
            Gerencie fornecedores, compare preços e controle acessos em um só lugar.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
            Use o sistema para cadastrar fornecedores, salvar links de catálogos, acompanhar preços por categoria e manter a área do gestor protegida com login.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {user ? (
              <>
                <Link href="/suppliers" className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100">
                  Abrir fornecedores
                </Link>
                <Link href="/users" className="rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                  Gerenciar usuários
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100">
                  Entrar no gestor
                </Link>
                <Link href="/setup" className="rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                  Configurar primeiro acesso
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-sm">
            <p className="text-sm text-gray-500">Segurança</p>
            <h2 className="mt-2 text-2xl font-black text-gray-900">Área de login</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              O painel do gestor agora pode ser protegido com autenticação antes de liberar fornecedores, comparativos e usuários.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-sm">
            <p className="text-sm text-gray-500">Acessos</p>
            <h2 className="mt-2 text-2xl font-black text-gray-900">CRUD de usuários</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Crie novos usuários, edite dados de acesso, desative logins e exclua contas quando necessário.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
