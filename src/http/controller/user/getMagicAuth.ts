import { z } from "zod"
import { prisma } from "@/lib/prisma"
import dayjs from "dayjs"
import fastify, { FastifyReply, FastifyRequest } from "fastify"
import { app } from "@/app"
import jwt from "jsonwebtoken"

const querySchema = z.object({
  code: z.string().min(1, "Código de autenticação é obrigatório"),
  redirect: z.string().url("URL de redirecionamento inválida").optional(),
})

const emailSchema = z.object({
  email: z.string().email(),
})

// Configurações do JWT e Cookie
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const MAGIC_LINK_EXPIRATION = "15m"
const AUTH_COOKIE_NAME = "auth_token"

// Configurações do cookie
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias em millisegundos
}
export async function getMagicAuth(
  request: FastifyRequest,
  reply: FastifyReply
) {
  await app.register(import("@fastify/cookie"), {
    secret: process.env.COOKIE_SECRET || "your-cookie-secret",
  })

  try {
    const { token } = request.query as { token?: string }

    if (!token) {
      return reply.status(400).send({
        error: "Token não fornecido",
      })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
      email: string
    }

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

    // Configurar o cookie com o token
    reply.setCookie(AUTH_COOKIE_NAME, authToken, COOKIE_OPTIONS)

    return reply.status(200).send({
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
