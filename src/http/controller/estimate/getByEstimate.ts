import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function getByEstimate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const invoiceParamsSchema = z.object({
    estimateId: z.string(),
  })

  const { estimateId } = invoiceParamsSchema.parse(request.params)

  if (!estimateId) {
    return reply.status(400).send({ error: "Missing estimateId" })
  } else {
    const invoice = await prisma.estimate.findUnique({
      where: {
        id: estimateId,
      },
      include: {
        EstimateItems: true,
      },
    })
    return invoice
  }
}
