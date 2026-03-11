import Link from 'next/link'
import Image from 'next/image'
import { getCurrentUser } from '@/lib/auth'

export default async function HomePage() {
  const user = await getCurrentUser()

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="reveal-up rounded-2xl border border-slate-200/80 bg-white/95 shadow-sm">
        <div className="border-b border-slate-200/80 px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Dashboard do sistema</p>
              <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Painel ERP - Controle de Fornecedores</h1>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
              <Image src="/brand/logo-familia-manto.png" alt="Logo Família Manto" width={20} height={20} className="h-5 w-5 rounded-md object-cover" />
              Ambiente operacional ativo
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-sm text-slate-600">Bem-vindo ao sistema web de gestão. Use os módulos abaixo para executar cadastros, análise de preços e administração de acessos.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Módulos</p>
                <p className="mt-1 text-2xl font-black text-slate-900">3</p>
                <p className="text-xs text-slate-600">Fornecedores, Comparativo, Usuários</p>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Perfil de acesso</p>
                <p className="mt-1 text-2xl font-black text-slate-900">RBAC</p>
                <p className="text-xs text-slate-600">Gestor e Operador com permissões distintas</p>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4 sm:col-span-2 lg:col-span-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Objetivo</p>
                <p className="mt-1 text-2xl font-black text-slate-900">Menor custo</p>
                <p className="text-xs text-slate-600">Decisão orientada por comparação de preços</p>
              </article>
            </div>

            <div className="flex flex-wrap gap-3">
              {user ? (
                <>
                  <Link href="/suppliers" className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
                    Acessar fornecedores
                  </Link>
                  <Link href="/suppliers/compare" className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                    Abrir comparativo
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
                    Entrar no sistema
                  </Link>
                  <Link href="/setup" className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                    Primeiro acesso
                  </Link>
                </>
              )}
            </div>
          </div>

          <aside className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-900 p-4 text-white">
            <div
              className="pointer-events-none absolute inset-0 opacity-45"
              style={{
                backgroundImage: "url('/backgrounds/maracana-erp.svg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              aria-hidden="true"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/70 to-slate-900/30" aria-hidden="true" />
            <div className="relative flex h-full min-h-[220px] flex-col justify-end">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">Visão operacional</p>
              <h2 className="mt-2 text-xl font-black">Maracanã como identidade visual</h2>
              <p className="mt-2 text-sm text-white/80">A atmosfera do estádio reforça performance, estratégia e decisão em tempo real.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="reveal-up stagger-1 rounded-xl border border-slate-200/80 bg-white/95 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cadastro</p>
          <h2 className="mt-1 text-lg font-black text-slate-900">Fornecedores</h2>
          <p className="mt-1 text-sm text-slate-600">Base central com contatos, links e dados de operação.</p>
        </article>
        <article className="reveal-up stagger-2 rounded-xl border border-slate-200/80 bg-white/95 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Análise</p>
          <h2 className="mt-1 text-lg font-black text-slate-900">Comparativo</h2>
          <p className="mt-1 text-sm text-slate-600">Classificação de preços por categoria para suporte à compra.</p>
        </article>
        <article className="reveal-up stagger-3 rounded-xl border border-slate-200/80 bg-white/95 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Governança</p>
          <h2 className="mt-1 text-lg font-black text-slate-900">Usuários</h2>
          <p className="mt-1 text-sm text-slate-600">Gestão de perfis e status de acesso em um único fluxo.</p>
        </article>
        <article className="reveal-up rounded-xl border border-slate-200/80 bg-white/95 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Produtividade</p>
          <h2 className="mt-1 text-lg font-black text-slate-900">Ações rápidas</h2>
          <p className="mt-1 text-sm text-slate-600">Navegação objetiva com foco em execução diária.</p>
        </article>
      </section>
    </main>
  )
}
