import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function getSupplier(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const supplierParamsSchema = z.object({
    id: z.string(),
    userId: z.string(),
  })

  const { id, userId } = supplierParamsSchema.parse(request.params)

  if (!id) {
    return reply.status(400).send({ error: "Missing email" })
  } else {
    const supplier = await prisma.supplier.findFirst({
      where: {
        id,
      },
      include: {
        Estimate: {
          where: {
            user_id: userId,
          },
        },
      },
    })
    return supplier
  }
}
