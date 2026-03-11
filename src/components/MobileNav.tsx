'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type MobileNavProps = {
  loggedIn: boolean
  isManager: boolean
}

type NavItem = {
  href: string
  label: string
}

export default function MobileNav({ loggedIn, isManager }: MobileNavProps) {
  const pathname = usePathname()

  const publicItems: NavItem[] = [
    { href: '/login', label: 'Entrar' },
    { href: '/setup', label: 'Setup' },
  ]

  const privateItems: NavItem[] = [
    { href: '/suppliers', label: 'Fornec.' },
    { href: '/suppliers/compare', label: 'Comparar' },
    ...(isManager ? [{ href: '/users', label: 'Usuários' }] : []),
    { href: '/suppliers/new', label: 'Novo' },
  ]

  const items = loggedIn ? privateItems : publicItems

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/95 px-2 pb-[calc(0.45rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur-lg md:hidden">
      <ul className="grid grid-cols-4 gap-1">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block rounded-xl px-2 py-2 text-center text-xs font-semibold transition ${
                  active
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
