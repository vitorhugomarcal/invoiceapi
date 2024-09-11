import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const estimateParamsSchema = z.object({
    estimateId: z.string(),
  })

  const { estimateId } = estimateParamsSchema.parse(request.params)

  if (!estimateId) {
    return reply.status(400).send({ error: "Missing estimateId" })
  } else {
    await prisma.estimate.delete({ where: { id: estimateId } })
    return reply.status(201).send()
  }
}
