import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function getSupplierByCNPJ(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const supplierParamsSchema = z.object({
    cnpj: z.string(),
  })

  const { cnpj } = supplierParamsSchema.parse(request.params)

  if (!cnpj) {
    return reply.status(400).send({ error: "Missing email" })
  } else {
    const supplier = await prisma.supplier.findFirst({
      where: {
        cnpj,
      },
    })
    return supplier
  }
}
