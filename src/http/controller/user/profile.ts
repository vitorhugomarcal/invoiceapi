// src/http/controllers/users/profile.ts
import { FastifyRequest, FastifyReply } from "fastify"
import { prisma } from "@/lib/prisma"

// Definição do tipo para o usuário JWT
interface UserJWTPayload {
  sub: string
  role?: string
  type?: string
}

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { sub: userId } = request.user as UserJWTPayload

    if (!userId) {
      return reply.status(401).send({ message: "Token inválido." })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        type: true,
        company_id: true,
        createdAt: true,
      },
    })

    if (!user) {
      return reply.status(404).send({ message: "Usuário não encontrado." })
    }

    return reply.status(200).send({
      user: {
        ...user,
        createdAt: user.createdAt.toISOString(),
      },
    })
  } catch (error) {
    console.error("Erro ao buscar perfil:", error)
    return reply.status(500).send({ message: "Erro interno do servidor." })
  }
}
