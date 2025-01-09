import jwt from "jsonwebtoken"

import type { FastifyReply, FastifyRequest } from "fastify"
import { prisma } from "@/lib/prisma"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function getMagicAuth(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { token } = request.query

    if (!token || typeof token !== "string") {
      return reply.status(400).send({
        error: "Token não fornecido",
      })
    }

    // Verificar o token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
      email: string
    }

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    })

    if (!user) {
      return reply.status(404).send({
        error: "Usuário não encontrado",
      })
    }

    // Gerar token de autenticação
    const authToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    )

    return reply.status(200).send({
      token: authToken,
      user: {
        id: user.id,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Erro ao verificar token:", error)
    return reply.status(400).send({
      error: "Token inválido ou expirado",
    })
  }
}
