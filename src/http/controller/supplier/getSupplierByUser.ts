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

  // Verificar se o userId está presente
  if (!userId) {
    return reply.status(400).send({ error: "Missing userId" })
  }

  try {
    // Buscar fornecedores relacionados ao usuário via tabela SupplierUser
    const suppliers = await prisma.supplier.findMany({
      where: {
        users: {
          some: {
            user_id: userId,
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
