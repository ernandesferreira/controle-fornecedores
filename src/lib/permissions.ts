
import { getCurrentUser } from '@/lib/auth'

export async function requireGestor() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error('Usuário não autenticado')
  }

  if (user.role !== 'GESTOR') {
    throw new Error('Acesso negado')
  }

  return user
}
