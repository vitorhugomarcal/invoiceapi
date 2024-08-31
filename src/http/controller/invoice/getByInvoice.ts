import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function getByInvoice(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const invoiceParamsSchema = z.object({
    invoiceId: z.string(),
  })

  const { invoiceId } = invoiceParamsSchema.parse(request.params)

  if (!invoiceId) {
    return reply.status(400).send({ error: "Missing invoiceId" })
  } else {
    const invoice = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
      },
      include: {
        InvoiceItems: true,
        client: true,
      },
    })
    return invoice
  }
}
