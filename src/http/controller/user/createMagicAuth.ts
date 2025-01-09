// src/routes/auth.ts
import { Resend } from "resend"
import jwt from "jsonwebtoken"
import { z } from "zod"
import type { FastifyReply, FastifyRequest } from "fastify"
import { prisma } from "@/lib/prisma"

const resend = new Resend(process.env.RESEND_API)
// Configurações do JWT
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const MAGIC_LINK_EXPIRATION = "15m" // 15 minutos

export async function createMagicAuth(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const emailSchema = z.object({
    email: z.string().email(),
  })

  try {
    // Validar o email recebido
    const { email } = emailSchema.parse(request.body)

    // Procurar ou criar usuário no banco
    let user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      user = await prisma.user.create({
        data: { email },
      })
    }

    // Criar token JWT
    const token = jwt.sign({ userId: user.id, email }, JWT_SECRET, {
      expiresIn: MAGIC_LINK_EXPIRATION,
    })

    // URL do frontend onde o usuário será redirecionado
    // const magicLink = `${process.env.FRONTEND_URL}/auth/verify?token=${token}`
    const magicLink = `http://192.168.1.145:5173/auth/verify?token=${token}`

    // Enviar email com o magic link usando Resend
    await resend.emails.send({
      from: "vitor@ipsec.com.br",
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
