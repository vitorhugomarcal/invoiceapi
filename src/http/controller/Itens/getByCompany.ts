import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function getByCompany(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const itensParamsSchema = z.object({
    companyId: z.string(),
  })

  const { companyId } = itensParamsSchema.parse(request.params)

  if (!companyId) {
    return reply.status(400).send({ error: "Missing companyId" })
  }

  const itens = await prisma.item.findMany({
    where: {
      company_id: companyId,
    },
  })
  return itens
}
