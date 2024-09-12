import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function getAllByUser(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const estimateParamsSchema = z.object({
    userId: z.string(),
  })

  const { userId } = estimateParamsSchema.parse(request.params)

  if (!userId) {
    return reply.status(400).send({ error: "Missing estimateId" })
  } else {
    const estimates = await prisma.estimate.findMany({
      where: {
        user_id: userId,
      },
      include: {
        EstimateItems: true,
        supplier: true,
      },
    })
    return estimates
  }
}
