// src/http/controllers/users/getMagicAuth.ts
import { FastifyReply, FastifyRequest } from "fastify"
import { prisma } from "@/lib/prisma"
import dayjs from "dayjs"
import { z } from "zod"
import jwt from "jsonwebtoken"
import { env } from "@/env"

// Schema para validação dos query params
const authQuerySchema = z.object({
  token: z.string(),
  redirect: z.string().default("/"),
})

const JWT_SECRET = env.JWT_SECRET
const TOKEN_EXPIRATION = "7m"

export async function getMagicAuth(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // Valida os parâmetros da query
    const { token, redirect } = authQuerySchema.parse(request.query)

    // Busca o link de autenticação no banco
    const authLink = await prisma.authLinks.findUnique({
      where: { token },
      include: {
        user: true,
      },
    })

    if (!authLink) {
      return reply.redirect(`/sign-in?error=invalid-link`)
    }

    // Verifica se o link expirou (7 dias)
    if (dayjs().diff(authLink.createdAt, "days") > 7) {
      // Deleta o link expirado
      await prisma.authLinks.delete({
        where: { token },
      })

      return reply.redirect(`/sign-in?error=expired-link`)
    }

    // Verifica se o usuário existe
    if (!authLink.user) {
      return reply.redirect(`/sign-in?error=user-not-found`)
    }

    // Gera o token JWT
    const authToken = jwt.sign(
      {
        userId: authLink.user.id,
        role: authLink.user.role,
        type: authLink.user.type,
      },
      JWT_SECRET,
      {
        expiresIn: TOKEN_EXPIRATION,
      }
    )

    console.log("AUTHTOKEN => ", authToken)

    // Salva o token nos cookies
    reply.setCookie("auth_token", authToken, {
      path: "/",
      secure: true,
      sameSite: "lax",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60, // 7 dias em segundos
    })

    // Deleta o link usado
    await prisma.authLinks.delete({
      where: { token },
    })

    // Redireciona para a URL especificada
    return reply.redirect(redirect)
  } catch (error) {
    console.error("Erro ao autenticar link:", error)
    return reply.redirect(`/sign-in?error=invalid-token`)
  }
}
