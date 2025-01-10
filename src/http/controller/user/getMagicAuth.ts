// src/http/controllers/users/getMagicAuth.ts
import { FastifyReply, FastifyRequest } from "fastify"
import { PrismaClient } from "@prisma/client"
import { verifyToken } from "@/utils/verify-token"

const prisma = new PrismaClient()

export async function getMagicAuth(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { token } = request.query as { token?: string }

    if (!token) {
      return reply.redirect(
        `${process.env.AUTH_REDIRECT_URL}/login?error=token-missing`
      )
    }

    // Usar o utilitário para verificar o token
    const decoded = verifyToken(token)

    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
    })

    if (!user) {
      return reply.redirect(
        `${process.env.AUTH_REDIRECT_URL}/login?error=user-not-found`
      )
    }

    // Gerar token de autenticação de 7 dias
    const authToken = await reply.jwtSign(
      {
        role: user.role,
        type: user.type,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: "7d",
        },
      }
    )

    // Configurar o cookie com o token
    reply.setCookie("auth_token", authToken, {
      path: "/",
      secure: true,
      sameSite: "lax",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    })

    // Redirecionar para a página inicial
    return reply.redirect(`${process.env.AUTH_REDIRECT_URL}/`)
  } catch (error) {
    console.error("Erro ao verificar token:", error)
    return reply.redirect(
      `${process.env.AUTH_REDIRECT_URL}/login?error=invalid-token`
    )
  }
}
