import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { Resend } from "resend"
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"
import { z } from "zod"

const prisma = new PrismaClient()
const resend = new Resend(process.env.RESEND_API)

// Schema de validação para o email
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

export async function authRoutes(app: FastifyInstance) {
  // Registrar o plugin de cookies
  await app.register(import("@fastify/cookie"), {
    secret: process.env.COOKIE_SECRET || "your-cookie-secret",
  })

  app.post(
    "/auth/magic-link",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { email } = emailSchema.parse(request.body)

        let user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user) {
          user = await prisma.user.create({
            data: { email },
          })
        }

        // Criar token JWT temporário para o magic link
        const token = jwt.sign({ userId: user.id, email }, JWT_SECRET, {
          expiresIn: MAGIC_LINK_EXPIRATION,
        })

        const magicLink = `${process.env.FRONTEND_URL}/auth/verify?token=${token}`

        await resend.emails.send({
          from: "Your App <noreply@yourapp.com>",
          to: email,
          subject: "Seu link de acesso",
          html: `
          <h1>Seu link de acesso</h1>
          <p>Clique no link abaixo para acessar sua conta:</p>
          <a href="${magicLink}">Acessar conta</a>
          <p>Este link expira em 15 minutos.</p>
        `,
        })

        return reply.status(200).send({
          message: "Magic link enviado com sucesso!",
        })
      } catch (error) {
        console.error("Erro ao processar magic link:", error)
        return reply.status(400).send({
          error: "Erro ao processar sua solicitação",
        })
      }
    }
  )

  app.get(
    "/auth/verify",
    async (request: FastifyRequest, reply: FastifyReply) => {
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
  )

  // Middleware para verificar autenticação
  app.addHook("preHandler", async (request, reply) => {
    const authToken = request.cookies[AUTH_COOKIE_NAME]

    try {
      if (authToken) {
        const decoded = jwt.verify(authToken, JWT_SECRET) as {
          userId: string
          email: string
        }
        request.user = decoded // TypeScript precisará de uma declaração de tipos para isso
      }
    } catch (error) {
      // Se o token for inválido, remove o cookie
      reply.clearCookie(AUTH_COOKIE_NAME)
    }
  })

  // Rota para logout
  app.post(
    "/auth/logout",
    async (request: FastifyRequest, reply: FastifyReply) => {
      reply.clearCookie(AUTH_COOKIE_NAME)
      return reply.status(200).send({
        message: "Logout realizado com sucesso",
      })
    }
  )
}
