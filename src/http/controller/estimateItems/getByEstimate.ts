import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function getByEstimate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const estimateItemsParamsSchema = z.object({
    estimateId: z.string(),
  })

  const { estimateId } = estimateItemsParamsSchema.parse(request.params)

  if (!estimateId) {
    return reply.status(400).send({ error: "Missing estimateId" })
  } else {
    const estimateItems = await prisma.estimateItems.findMany({
      where: {
        estimate_id: estimateId,
      },
    })
    if (!estimateItems) {
      return []
    } else {
      return estimateItems
    }
  }
}
