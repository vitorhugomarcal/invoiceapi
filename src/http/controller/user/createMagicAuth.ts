// src/http/controllers/users/createMagicAuth.ts
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { PrismaClient } from "@prisma/client"
import { Resend } from "resend"

const prisma = new PrismaClient()
const resend = new Resend(process.env.RESEND_API)

const createMagicAuthSchema = z.object({
  email: z.string().email(),
})

export async function createMagicAuth(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { email } = createMagicAuthSchema.parse(request.body)

    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Se não encontrar o usuário, retorna erro
    if (!user) {
      return reply.status(400).send({
        code: "USER_NOT_FOUND",
        message: "Usuário não cadastrado.",
      })
    }

    // Criar token JWT temporário
    const token = await reply.jwtSign(
      {
        userId: user.id,
        email: user.email,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: "15m",
        },
      }
    )

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
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        code: "VALIDATION_ERROR",
        message: "Email inválido.",
      })
    }

    console.error("Erro ao criar link de autenticação:", error)
    return reply.status(500).send({
      code: "INTERNAL_SERVER_ERROR",
      message: "Erro interno do servidor.",
    })
  }
}
