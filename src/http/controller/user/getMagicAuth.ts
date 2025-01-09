import jwt from "jsonwebtoken"
import type { FastifyReply, FastifyRequest } from "fastify"
import { prisma } from "@/lib/prisma"
import dayjs from "dayjs"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function getMagicAuth(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { code, redirect } = request.query as {
      code: string
      redirect: string
    }

    if (!code || typeof code !== "string") {
      return reply.status(400).send({
        error: "Código de autenticação não fornecido",
      })
    }

    // Buscar o código de autenticação no banco
    const authLink = await prisma.authLinks.findFirst({
      where: { code },
    })

    if (!authLink) {
      return reply.status(401).send({
        error: "Código inválido ou não encontrado",
      })
    }

    // Verificar se o link expirou (validade de 7 dias)
    if (dayjs().diff(authLink.createdAt, "days") > 7) {
      await prisma.authLinks.delete({
        where: { code },
      })
      return reply.status(401).send({
        error: "Código expirado",
      })
    }

    // Gerar token JWT de autenticação
    const authToken = jwt.sign(
      {
        sub: authLink.userId,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    )

    // Remover o código de autenticação do banco
    await prisma.authLinks.delete({
      where: { code },
    })

    // Redirecionar ou enviar token
    if (redirect) {
      reply.redirect(`${redirect}?token=${authToken}`)
    } else {
      reply.status(200).send({
        token: authToken,
        user: {
          id: authLink.userId,
        },
      })
    }
  } catch (error) {
    console.error("Erro ao processar autenticação via link:", error)
    return reply.status(400).send({
      error: "Erro ao processar autenticação",
    })
  }
}
