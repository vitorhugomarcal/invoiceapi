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
  } 
    const items = await prisma.estimateItems.findUnique({
      where: { id: itemEstimateId },
    })

    if (!items) {
      return reply.status(404).send({ error: "Items not found" })
    } 

      await prisma.estimateItems.update({
        where: { id: itemEstimateId },
        data: {
          name,
          quantity,
        },
      })

  return reply.status(204).send()
}
