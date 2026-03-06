import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createSessionCookie } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const totalUsers = await prisma.user.count()
    if (totalUsers > 0) {
      return NextResponse.json({ error: 'Setup inicial já foi concluído.' }, { status: 400 })
    }

    const body = await req.json()
    const name = String(body.name || '').trim()
    const email = String(body.email || '').trim().toLowerCase()
    const password = String(body.password || '')

    if (!name || !email || password.length < 6) {
      return NextResponse.json({ error: 'Preencha nome, e-mail e senha com pelo menos 6 caracteres.' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    })

    await createSessionCookie({ userId: user.id, email: user.email, role: user.role })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao concluir setup inicial.' }, { status: 500 })
  }
}
