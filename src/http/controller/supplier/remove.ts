import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const supplierParamsSchema = z.object({
    supplierId: z.string(),
  })

  const { supplierId } = supplierParamsSchema.parse(request.params)

  if (!supplierId) {
    return reply.status(400).send({ error: "Missing clientId" })
  } else {
    await prisma.supplier.delete({ where: { id: supplierId } })
    return reply.status(201).send()
  }
}
