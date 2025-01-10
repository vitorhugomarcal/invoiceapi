// src/http/controllers/users/getMagicAuth.ts
import { FastifyReply, FastifyRequest } from "fastify"
import { PrismaClient } from "@prisma/client"

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

    // Verificar o token
    const { sub } = await request.jwtVerify()

    const user = await prisma.user.findUnique({
      where: { id: sub },
    })

    if (!user) {
      return reply.redirect(
        `${process.env.AUTH_REDIRECT_URL}/login?error=user-not-found`
      )
    }

    // Gerar token de autenticação de 7 dias
    const authToken = await reply.jwtSign(
      {
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
