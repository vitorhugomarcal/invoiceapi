import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function getByUser(request: FastifyRequest, reply: FastifyReply) {
  const itensParamsSchema = z.object({
    userId: z.string(),
  })

  const { userId } = itensParamsSchema.parse(request.params)

  if (!userId) {
    return reply.status(400).send({ error: "Missing userId" })
  } else {
    const itens = await prisma.item.findMany({
      where: {
        user_id: userId,
      },
    })
    return itens
  }
}
