// src/http/controllers/users/createMagicAuth.ts
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { PrismaClient } from "@prisma/client"
import { Resend } from "resend"
import jwt from "jsonwebtoken"
import { env } from "@/env"

const prisma = new PrismaClient()
const resend = new Resend(process.env.RESEND_API)

const createMagicAuthSchema = z.object({
  email: z.string().email(),
})

const JWT_SECRET = env.JWT_SECRET
const MAGIC_LINK_EXPIRATION = "7d"

export async function createMagicAuth(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { email } = createMagicAuthSchema.parse(request.body)

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return reply.status(400).send({
        code: "USER_NOT_FOUND",
        message: "Usuário não cadastrado.",
      })
    }

    // Criar token JWT temporário
    const token = jwt.sign({ userId: user.id, email }, JWT_SECRET, {
      expiresIn: MAGIC_LINK_EXPIRATION,
    })

    const magicLink = `${process.env.API_BASE_URL}/auth/verify?token=${token}&redirect=${process.env.AUTH_REDIRECT_URL}`

    await resend.emails.send({
      from: "no-reply@update.ipsec.com.br",
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
