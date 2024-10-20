import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function getSupplierByCompany(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const supplierParamsSchema = z.object({
    companyId: z.string(),
  })

  const { companyId } = supplierParamsSchema.parse(request.params)

  // Verificar se o companyId está presente
  if (!companyId) {
    return reply.status(400).send({ error: "Missing companyId" })
  }

  try {
    // Buscar fornecedores relacionados ao usuário via tabela SupplierUser
    const suppliers = await prisma.supplier.findMany({
      where: {
        supplierUser: {
          some: {
            company_id: companyId,
          },
        },
      },
    })

    return reply.status(200).send(suppliers)
  } catch (error) {
    console.error("Error fetching suppliers: ", error)
    return reply.status(500).send({ error: "Failed to fetch suppliers" })
  }
}
