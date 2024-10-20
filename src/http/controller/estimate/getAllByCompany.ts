import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function getAllByCompany(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const estimateParamsSchema = z.object({
    companyId: z.string(),
  })

  const { companyId } = estimateParamsSchema.parse(request.params)

  if (!companyId) {
    return reply.status(400).send({ error: "Missing estimateId" })
  }
  const estimates = await prisma.estimate.findMany({
    where: {
      company_id: companyId,
    },
    include: {
      estimateItems: true,
      supplier: true,
    },
  })
  return estimates
}
