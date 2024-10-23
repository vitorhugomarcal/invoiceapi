import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function getUserById(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userParamsSchema = z.object({
    userId: z.string().uuid("Formato de ID inválido."),
  })

  try {
    const { userId } = userParamsSchema.parse(request.params)

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return reply.status(404).send({ error: "Usuário não encontrado." })
    }

    return reply.status(200).send(user)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ error: error.errors })
    }
    return reply.status(500).send({ error: "Erro interno do servidor." })
  }
}
