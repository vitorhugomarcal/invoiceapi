import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function getEstimateBySupplier(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const invoiceParamsSchema = z.object({
    companyId: z.string(),
    supplierId: z.string(),
  })

  const { companyId, supplierId } = invoiceParamsSchema.parse(request.params)

  if (!supplierId) {
    return reply.status(400).send({ error: "Missing supplierId" })
  } 
    const invoice = await prisma.estimate.findMany({
      where: {
        supplier_id: supplierId,
        company_id: companyId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return invoice
}
