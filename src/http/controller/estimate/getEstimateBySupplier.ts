import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function getEstimateBySupplier(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const invoiceParamsSchema = z.object({
    userId: z.string(),
    supplierId: z.string(),
  })

  const { userId, supplierId } = invoiceParamsSchema.parse(request.params)

  if (!supplierId) {
    return reply.status(400).send({ error: "Missing supplierId" })
  } else {
    const invoice = await prisma.estimate.findMany({
      where: {
        supplier_id: supplierId,
        user_id: userId,
      },
      orderBy: {
        created_at: "desc",
      },
    })
    return invoice
  }
}
