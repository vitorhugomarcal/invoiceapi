import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const clientParamsSchema = z.object({
    clientId: z.string(),
  })

  const { clientId } = clientParamsSchema.parse(request.params)

  if (!clientId) {
    return reply.status(400).send({ error: "Missing clientId" })
  }

  await prisma.client.delete({ where: { id: clientId } })
  return reply.status(201).send()
}
