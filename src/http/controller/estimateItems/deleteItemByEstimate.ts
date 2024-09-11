import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function deleteItemByEstimate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const estimateItemsParamsSchema = z.object({
    itemId: z.string(),
  })

  const { itemId } = estimateItemsParamsSchema.parse(request.params)

  if (!itemId) {
    return reply.status(400).send({ error: "Missing itemId" })
  } else {
    await prisma.estimateItems.delete({
      where: {
        id: itemId,
      },
    })
    return reply.status(201).send()
  }
}
