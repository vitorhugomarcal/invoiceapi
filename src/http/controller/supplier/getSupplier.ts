import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function getSupplier(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const supplierParamsSchema = z.object({
    id: z.string(),
    companyId: z.string(),
  })

  const { id, companyId } = supplierParamsSchema.parse(request.params)

  if (!id) {
    return reply.status(400).send({ error: "Missing email" })
  }

  const supplier = await prisma.supplier.findFirst({
    where: {
      id,
    },
    include: {
      estimate: {
        where: {
          company_id: companyId,
        },
      },
    },
  })
  return supplier
}
