import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

const COOKIE_NAME = 'gestor_session'

function getJwtSecret() {
  return new TextEncoder().encode(process.env.AUTH_SECRET || 'change-me-in-production')
}

export type SessionPayload = {
  userId: string
  email: string
  role: 'GESTOR' | 'OPERADOR'
}

export async function createSessionCookie(payload: SessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getJwtSecret())

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) return null

  try {
    const verified = await jwtVerify(token, getJwtSecret())
    return verified.payload as unknown as SessionPayload
  } catch {
    return null
  }
}

export async function getCurrentUser() {
  const session = await getSession()
  if (!session) return null

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
    },
  })

  if (!user || !user.active) return null
  return user
}

export async function requireCurrentUser() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return user
}

export async function requireManagerUser() {
  const user = await requireCurrentUser()
  if (user.role !== 'GESTOR') redirect('/suppliers')
  return user
}

export function isManagerRole(role: 'GESTOR' | 'OPERADOR') {
  return role === 'GESTOR'
}

export async function userCount() {
  try {
    return await prisma.user.count()
  } catch (error) {
    console.error('Erro ao contar usuários:', error)
    return 0
  }
}
