import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function getUserByEmail(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userParamsSchema = z.object({
    email: z.string(),
  })

  const { email } = userParamsSchema.parse(request.params)

  if (!email) {
    return reply.status(400).send({ error: "Missing email" })
  } else {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        Company: true,
        Client: true,
        Invoice: {
          include: {
            client: true,
          },
          orderBy: { created_at: "desc" },
        },
        Item: true,
        UnitTypeCustom: true,
      },
    })

    const suppliers = await prisma.supplierUser.findMany({
      where: {
        user_id: user?.id, // Supondo que você tenha o `userId`
      },
      include: {
        supplier: true, // Incluir os detalhes do fornecedor
      },
    })

    const Supplier = suppliers.map((entry) => entry.supplier)
    return { user, Supplier }
  }
}
