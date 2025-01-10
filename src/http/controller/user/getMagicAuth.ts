import type { FastifyReply, FastifyRequest } from "fastify"
import { prisma } from "@/lib/prisma"
import dayjs from "dayjs"

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

    // Remover o código de autenticação do banco
    await prisma.authLinks.delete({
      where: { code },
    })

    // Assinar o usuário usando o método do plugin
    const token = await request.signUser({
      sub: authLink.userId,
    })

    // Redirecionar ou enviar confirmação
    if (redirect) {
      reply.redirect(`${redirect}`)
    } else {
      reply.status(200).send({
        message: "Autenticação realizada com sucesso",
        token,
      })
    }
  } catch (error) {
    console.error("Erro ao processar autenticação via link:", error)
    return reply.status(400).send({
      error: "Erro ao processar autenticação",
    })
  }
}
