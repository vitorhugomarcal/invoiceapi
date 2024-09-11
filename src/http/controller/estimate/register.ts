import { prisma } from "@/lib/prisma"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    estimate_number: z.string().optional(),
    status: z.string().optional(),
    notes: z.string().optional(),
  })

  const { estimate_number, status, notes } = registerBodySchema.parse(
    request.body
  )

  const invoiceParamsSchema = z.object({
    userId: z.string(),
    supplierId: z.string(),
  })

  const { supplierId, userId } = invoiceParamsSchema.parse(request.params)

  const supplier = await prisma.supplier.findUnique({
    where: { id: supplierId },
  })
  if (!supplier) {
    return reply.status(404).send({ error: "Supplier not found" })
  }
  const invoice = await prisma.estimate.create({
    data: {
      user_id: userId,
      supplier_id: supplier.id,
      estimate_number,
      status,
      notes,
    },
  })

  return invoice
}
