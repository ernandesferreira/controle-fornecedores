import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createSessionCookie } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email = String(body.email || '').trim().toLowerCase()
    const password = String(body.password || '')

    if (!email || !password) {
      return NextResponse.json({ error: 'Informe e-mail e senha.' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.active) {
      return NextResponse.json({ error: 'Usuário ou senha inválidos.' }, { status: 401 })
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash)
    if (!validPassword) {
      return NextResponse.json({ error: 'Usuário ou senha inválidos.' }, { status: 401 })
    }

    await createSessionCookie({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao fazer login.' }, { status: 500 })
  }
}
