import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function getInvoiceByCompany(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const invoiceParamsSchema = z.object({
    companyId: z.string(),
  })

  const { companyId } = invoiceParamsSchema.parse(request.params)

  if (!companyId) {
    return reply.status(400).send({ error: "Missing companyId" })
  } else {
    const invoice = await prisma.invoice.findMany({
      where: {
        company_id: companyId,
      },
      include: {
        client: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return invoice
  }
}
