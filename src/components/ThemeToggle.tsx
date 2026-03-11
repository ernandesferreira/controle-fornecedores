'use client'

import { useEffect, useState } from 'react'

type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'theme-mode'

function applyTheme(theme: ThemeMode) {
  document.documentElement.setAttribute('data-theme', theme)
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>('light')

  useEffect(() => {
    const fromDocument = document.documentElement.getAttribute('data-theme') as ThemeMode | null
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const nextTheme: ThemeMode = fromDocument || saved || (prefersDark ? 'dark' : 'light')
    setTheme(nextTheme)
    applyTheme(nextTheme)
    localStorage.setItem(STORAGE_KEY, nextTheme)

    function syncTheme() {
      const current = (document.documentElement.getAttribute('data-theme') as ThemeMode | null) || 'light'
      setTheme(current)
    }

    window.addEventListener('theme-change', syncTheme)
    window.addEventListener('storage', syncTheme)

    return () => {
      window.removeEventListener('theme-change', syncTheme)
      window.removeEventListener('storage', syncTheme)
    }
  }, [])

  function handleToggle() {
    const next: ThemeMode = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    applyTheme(next)
    localStorage.setItem(STORAGE_KEY, next)
    window.dispatchEvent(new Event('theme-change'))
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
      aria-pressed={theme === 'dark'}
      aria-label="Alternar tema"
      title="Alternar tema"
    >
      {theme === 'light' ? 'Tema escuro' : 'Tema claro'}
    </button>
  )
}
