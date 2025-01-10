import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import dayjs from "dayjs"

const querySchema = z.object({
  code: z.string().min(1, "Código de autenticação é obrigatório"),
  redirect: z.string().url("URL de redirecionamento inválida").optional(),
})

class AuthError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number
  ) {
    super(message)
    this.name = "AuthError"
  }
}

export async function getMagicAuth(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { code, redirect } = querySchema.parse(request.query)

    const authLink = await prisma.authLinks.findFirst({
      where: { code },
    })

    if (!authLink) {
      throw new AuthError(
        "Código inválido ou não encontrado",
        "INVALID_CODE",
        401
      )
    }

    const isExpired = dayjs().diff(authLink.createdAt, "minutes") > 15

    if (isExpired) {
      await prisma.authLinks.delete({
        where: { id: authLink.id },
      })

      throw new AuthError(
        "Link de acesso expirado. Por favor, solicite um novo link.",
        "LINK_EXPIRED",
        401
      )
    }

    const payload = {
      sub: authLink.userId,
    }

    // Assinar o JWT e definir o cookie
    await reply.signUser(payload)

    // Redirecionar ou retornar resposta
    if (redirect) {
      return reply.redirect(302, redirect)
    }

    return reply.status(200).send({
      code: "AUTH_SUCCESS",
      message: "Autenticação realizada com sucesso",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        code: "VALIDATION_ERROR",
        message: "Dados inválidos",
        details: error.errors,
      })
    }

    if (error instanceof AuthError) {
      return reply.status(error.statusCode).send({
        code: error.code,
        message: error.message,
      })
    }

    console.error("Erro não esperado na autenticação:", error)

    return reply.status(500).send({
      code: "INTERNAL_ERROR",
      message:
        "Erro interno do servidor. Por favor, tente novamente mais tarde.",
    })
  }
}

// Extensão dos tipos do Fastify
declare module "fastify" {
  interface FastifyInstance {
    signUser: (payload: { sub: string }) => Promise<void>
  }
  interface FastifyReply {
    signUser: (payload: { sub: string }) => Promise<void>
  }
}
