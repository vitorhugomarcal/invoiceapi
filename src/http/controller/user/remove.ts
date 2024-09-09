import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const userParamsSchema = z.object({
    userId: z.string(),
  })

  const { userId } = userParamsSchema.parse(request.params)

  if (!userId) {
    return reply.status(400).send({ error: "Missing userId" })
  } else {
    await prisma.user.delete({ where: { id: userId } })
    return reply.status(201).send()
  }
}
