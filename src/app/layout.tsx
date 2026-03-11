import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Manrope, Sora } from 'next/font/google'
import { getCurrentUser } from '@/lib/auth'
import LogoutButton from '@/components/LogoutButton'
import MobileNav from '@/components/MobileNav'
import ThemeToggle from '@/components/ThemeToggle'

export const metadata: Metadata = {
  title: 'Controle de Fornecedores',
  description: 'Cadastro de fornecedores com tabela de preços, login e gestão de usuários',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },
}

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
})

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-display',
})

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser()
  const navBase = 'nav-link'

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${manrope.variable} ${sora.variable} app-shell text-[var(--foreground)] antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    const key = 'theme-mode';
    const saved = localStorage.getItem(key);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  } catch (_) {}
})();`,
          }}
        />
        <div className="app-shell">
          <header className="sticky top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-3">
                <Link href="/" className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-white/70 bg-white shadow-sm">
                    <Image
                      src="/brand/logo-familia-manto.png"
                      alt="Logo Família Manto"
                      width={40}
                      height={40}
                      className="h-10 w-10 object-cover"
                      priority
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Controle de Fornecedores</p>
                    <p className="text-xs text-slate-500">Gestão de catálogos, preços e acessos</p>
                  </div>
                </Link>

                <nav className="hidden items-center gap-2 md:flex">
                  <ThemeToggle />
                  <Link href="/" className={navBase}>Início</Link>
                  {user ? (
                    <>
                      <Link href="/suppliers" className={navBase}>Fornecedores</Link>
                      <Link href="/suppliers/compare" className={navBase}>Comparativo</Link>
                      {user.role === 'GESTOR' ? (
                        <Link href="/users" className={navBase}>Usuários</Link>
                      ) : null}
                      <Link href="/suppliers/new" className="cta-primary px-4 py-2 text-sm">Novo fornecedor</Link>
                      <div className="ml-2 flex items-center gap-3 border-l border-slate-200 pl-4">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email} • {user.role === 'GESTOR' ? 'Gestor' : 'Operador'}</p>
                        </div>
                        <LogoutButton />
                      </div>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className={navBase}>Entrar</Link>
                      <Link href="/setup" className="cta-primary px-4 py-2 text-sm">Primeiro acesso</Link>
                    </>
                  )}
                </nav>

                <div className="md:hidden">
                  <details className="relative">
                    <summary className="list-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                      Menu
                    </summary>
                    <div className="glass-panel absolute right-0 mt-3 w-[min(88vw,22rem)] rounded-2xl p-3 shadow-xl">
                      <div className="flex flex-col gap-1">
                        <div className="mb-2">
                          <ThemeToggle />
                        </div>
                        <Link href="/" className={navBase}>Início</Link>
                        {user ? (
                          <>
                            <Link href="/suppliers" className={navBase}>Fornecedores</Link>
                            <Link href="/suppliers/compare" className={navBase}>Comparativo</Link>
                            {user.role === 'GESTOR' ? <Link href="/users" className={navBase}>Usuários</Link> : null}
                            <Link href="/suppliers/new" className="cta-primary mt-2 px-4 py-2 text-center text-sm">Novo fornecedor</Link>
                            <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
                              <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                              <p className="text-xs text-slate-500">{user.email}</p>
                              <p className="mt-1 text-xs font-medium text-blue-700">{user.role === 'GESTOR' ? 'Gestor' : 'Operador'}</p>
                            </div>
                            <div className="mt-2">
                              <LogoutButton />
                            </div>
                          </>
                        ) : (
                          <>
                            <Link href="/login" className={navBase}>Entrar</Link>
                            <Link href="/setup" className="cta-primary mt-2 px-4 py-2 text-center text-sm">Primeiro acesso</Link>
                          </>
                        )}
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          </header>

          <div className="pb-24 md:pb-0">{children}</div>
          <MobileNav loggedIn={!!user} isManager={user?.role === 'GESTOR'} />
        </div>
      </body>
    </html>
  )
}
