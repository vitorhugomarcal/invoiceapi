import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function getByInvoice(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const invoiceItemsParamsSchema = z.object({
    invoiceId: z.string(),
  })

  const { invoiceId } = invoiceItemsParamsSchema.parse(request.params)

  if (!invoiceId) {
    return reply.status(400).send({ error: "Missing invoiceId" })
  } else {
    const itensInvoice = await prisma.invoiceItems.findMany({
      where: {
        invoice_id: invoiceId,
      },
    })
    return itensInvoice
  }
}
