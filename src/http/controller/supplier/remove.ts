import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const removeParamsSchema = z.object({
    supplierId: z.string(),
    companyId: z.string(), // Adicionando companyId para especificar o usuário
  })

  const { supplierId, companyId } = removeParamsSchema.parse(request.params)

  if (!supplierId || !companyId) {
    return reply.status(400).send({ error: "Missing supplierId or companyId" })
  }

  try {
    // Remover apenas a associação entre o fornecedor e o usuário específico
    const deletedAssociation = await prisma.supplierUser.delete({
      where: {
        supplier_id_company_id: {
          supplier_id: supplierId,
          company_id: companyId,
        },
      },
    })

    if (!deletedAssociation) {
      return reply.status(404).send({ error: "Association not found" })
    }

    return reply.status(200).send({ message: "Supplier removed from user" })
  } catch (error) {
    return reply
      .status(500)
      .send({ error: "Failed to remove supplier from user" })
  }
}
