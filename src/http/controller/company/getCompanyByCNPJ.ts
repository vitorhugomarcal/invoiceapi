import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function getCompanyByCNPJ(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const companyParamsSchema = z.object({
    cnpj: z.string(),
  })

  const { cnpj } = companyParamsSchema.parse(request.params)

  if (!cnpj) {
    return reply.status(400).send({ error: "Missing email" })
  } else {
    const company = await prisma.company.findFirst({
      where: {
        cnpj,
      },
      include: {
        invoice: {
          include: {
            client: true,
          },
          orderBy: {
            createdAt: "desc",
          }
        },
        client: true,
        supplierUser: true,
        item: true,
        paymentModeCustom: true,
        unitTypeCustom: true,
        estimate: true,
        pendingUsers: true,
        user: true,
      }
    })
    return reply.status(200).send(company)
  }
}
