import { prisma } from "@/lib/prisma"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function registerCompany(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const registerBodySchema = z.object({
    companyId: z.string(),
  })

  const { companyId } = registerBodySchema.parse(request.body)

  const supplierParamsSchema = z.object({
    supplierId: z.string(),
  })

  const { supplierId } = supplierParamsSchema.parse(request.params)

  // Verifica se o fornecedor existe
  const existingSupplier = await prisma.supplier.findUnique({
    where: { id: supplierId },
  })

  if (!existingSupplier) {
    return reply.status(404).send({ error: "Supplier not found" })
  }

  // Verifica se o usuário existe
  const company = await prisma.company.findUnique({ where: { id: companyId } })
  if (!company) {
    return reply.status(404).send({ error: "User not found" })
  }

  // Verifica se a associação já existe entre o fornecedor e o usuário
  const supplierUserExists = await prisma.supplierUser.findUnique({
    where: {
      supplier_id_company_id: {
        supplier_id: supplierId,
        company_id: companyId,
      },
    },
  })

  if (supplierUserExists) {
    return reply
      .status(409)
      .send({ error: "Supplier is already associated with this user" })
  }

  // Cria a nova associação entre o fornecedor e o usuário
  await prisma.supplierUser.create({
    data: {
      supplier_id: supplierId,
      company_id: companyId,
    },
  })

  return reply
    .status(200)
    .send({ message: "Supplier successfully associated with the user" })
}