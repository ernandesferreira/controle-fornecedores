import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const PUBLIC_PATHS = ['/', '/login', '/setup']

function getJwtSecret() {
  return new TextEncoder().encode(process.env.AUTH_SECRET || 'change-me-in-production')
}

async function isAuthenticated(request: NextRequest) {
  const token = request.cookies.get('gestor_session')?.value
  if (!token) return false

  try {
    await jwtVerify(token, getJwtSecret())
    return true
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublic =
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')

  const protectedPath = pathname.startsWith('/suppliers') || pathname.startsWith('/users')

  if (protectedPath && !(await isAuthenticated(request))) {
    const url = new URL('/login', request.url)
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  if ((pathname === '/login' || pathname === '/setup') && (await isAuthenticated(request))) {
    return NextResponse.redirect(new URL('/suppliers', request.url))
  }

  if (!isPublic && pathname.startsWith('/api') && !(await isAuthenticated(request))) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
