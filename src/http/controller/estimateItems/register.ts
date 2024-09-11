import { prisma } from "@/lib/prisma"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    quantity: z.number(),
  })

  const { name, quantity } = registerBodySchema.parse(request.body)

  const estimateParamsSchema = z.object({
    estimateId: z.string(),
  })

  const { estimateId } = estimateParamsSchema.parse(request.params)

  const estimate = await prisma.estimate.findUnique({
    where: { id: estimateId },
  })
  if (!estimate) {
    return reply.status(404).send({ error: "Client not found" })
  }
  await prisma.estimateItems.create({
    data: {
      estimate_id: estimate.id,
      name,
      quantity,
    },
  })

  return reply.status(201).send()
}
