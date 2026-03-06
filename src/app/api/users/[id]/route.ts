import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(_: Request, { params }: Params) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }
    if (currentUser.role !== 'GESTOR') {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    }

    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao buscar usuário.' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }
    if (currentUser.role !== 'GESTOR') {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()

    const name = String(body.name || '').trim()
    const email = String(body.email || '').trim().toLowerCase()
    const password = String(body.password || '')
    const active = body.active !== false
    const role = body.role === 'OPERADOR' ? 'OPERADOR' : 'GESTOR'

    if (!name || !email) {
      return NextResponse.json({ error: 'Preencha nome e e-mail.' }, { status: 400 })
    }

    const existing = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id },
      },
    })

    if (existing) {
      return NextResponse.json({ error: 'Já existe um usuário com este e-mail.' }, { status: 400 })
    }

    if (!active) {
      const activeUsers = await prisma.user.count({ where: { active: true } })
      if (activeUsers <= 1 && currentUser.id === id) {
        return NextResponse.json({ error: 'Não é possível desativar o último usuário ativo.' }, { status: 400 })
      }
    }

    if (currentUser.id === id && role !== 'GESTOR') {
      return NextResponse.json({ error: 'Você não pode alterar seu próprio perfil para Operador.' }, { status: 400 })
    }

    const managers = await prisma.user.count({ where: { role: 'GESTOR', active: true } })
    const targetUser = await prisma.user.findUnique({ where: { id }, select: { role: true, active: true } })

    if (!targetUser) {
      return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 })
    }

    const removingLastManagerRole = targetUser.role === 'GESTOR' && role !== 'GESTOR' && targetUser.active
    const disablingLastManager = targetUser.role === 'GESTOR' && !active && targetUser.active

    if (managers <= 1 && (removingLastManagerRole || disablingLastManager)) {
      return NextResponse.json({ error: 'O sistema precisa manter pelo menos um Gestor ativo.' }, { status: 400 })
    }

    const data: {
      name: string
      email: string
      role: 'GESTOR' | 'OPERADOR'
      active: boolean
      passwordHash?: string
    } = { name, email, role, active }

    if (password) {
      if (password.length < 6) {
        return NextResponse.json({ error: 'A senha precisa ter pelo menos 6 caracteres.' }, { status: 400 })
      }
      data.passwordHash = await bcrypt.hash(password, 10)
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao atualizar usuário.' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }
    if (currentUser.role !== 'GESTOR') {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    }

    const { id } = await params

    const totalUsers = await prisma.user.count()
    if (totalUsers <= 1) {
      return NextResponse.json({ error: 'Não é possível excluir o único usuário do sistema.' }, { status: 400 })
    }

    if (currentUser.id === id) {
      return NextResponse.json({ error: 'Você não pode excluir o seu próprio usuário.' }, { status: 400 })
    }

    const targetUser = await prisma.user.findUnique({ where: { id }, select: { role: true, active: true } })
    if (!targetUser) {
      return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 })
    }

    if (targetUser.role === 'GESTOR' && targetUser.active) {
      const managers = await prisma.user.count({ where: { role: 'GESTOR', active: true } })
      if (managers <= 1) {
        return NextResponse.json({ error: 'O sistema precisa manter pelo menos um Gestor ativo.' }, { status: 400 })
      }
    }

    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao excluir usuário.' }, { status: 500 })
  }
}
