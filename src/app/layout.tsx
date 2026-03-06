import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import LogoutButton from '@/components/LogoutButton'

export const metadata: Metadata = {
  title: 'Controle de Fornecedores',
  description: 'Cadastro de fornecedores com tabela de preços, login e gestão de usuários',
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser()

  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[radial-gradient(circle_at_top,_#f3f4f6,_#eef2ff_35%,_#f8fafc_70%)] text-gray-900 antialiased">
        <div className="min-h-screen">
          <header className="sticky top-0 z-30 border-b border-white/60 bg-white/85 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-900 text-sm font-bold text-white shadow-sm">
                  CF
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Controle de Fornecedores</p>
                  <p className="text-xs text-gray-500">Gestão de catálogos, preços e acessos</p>
                </div>
              </Link>

              <nav className="hidden items-center gap-2 md:flex">
                <Link href="/" className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900">Início</Link>
                {user ? (
                  <>
                    <Link href="/suppliers" className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900">Fornecedores</Link>
                    <Link href="/suppliers/compare" className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900">Comparativo</Link>
                    {user.role === 'GESTOR' ? (
                      <Link href="/users" className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900">Usuários</Link>
                    ) : null}
                    <Link href="/suppliers/new" className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800">Novo fornecedor</Link>
                    <div className="ml-2 flex items-center gap-3 border-l border-gray-200 pl-4">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email} • {user.role === 'GESTOR' ? 'Gestor' : 'Operador'}</p>
                      </div>
                      <LogoutButton />
                    </div>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900">Entrar</Link>
                    <Link href="/setup" className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800">Primeiro acesso</Link>
                  </>
                )}
              </nav>
            </div>
          </header>

          {children}
        </div>
      </body>
    </html>
  )
}
