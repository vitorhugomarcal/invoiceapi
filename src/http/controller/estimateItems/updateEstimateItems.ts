import { FastifyRequest, FastifyReply } from "fastify"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export async function updateEstimateItems(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const updateItemParamsSchema = z.object({
    name: z.string().optional(),
    quantity: z.number().min(0).optional(),
  })

  const itemParamsSchema = z.object({
    itemEstimateId: z.string(),
  })

  const { itemEstimateId } = itemParamsSchema.parse(request.params)

  const { name, quantity } = updateItemParamsSchema.parse(request.body)

  if (!itemEstimateId) {
    return reply.status(400).send({ error: "Missing userId" })
  } else {
    const user = await prisma.estimateItems.findUnique({
      where: { id: itemEstimateId },
    })
    if (!user) {
      return reply.status(404).send({ error: "User not found" })
    } else {
      await prisma.estimateItems.update({
        where: { id: itemEstimateId },
        data: {
          name,
          quantity,
        },
      })
    }
  }

  return reply.status(204).send()
}
