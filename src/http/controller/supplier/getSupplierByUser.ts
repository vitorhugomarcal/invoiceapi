import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function getSupplierByUser(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const supplierParamsSchema = z.object({
    userId: z.string(),
  })

  const { userId } = supplierParamsSchema.parse(request.params)

  if (!userId) {
    return reply.status(400).send({ error: "Missing email" })
  } else {
    const supplier = await prisma.supplier.findMany({
      where: {
        user_id: userId,
      },
    })
    return supplier
  }
}
