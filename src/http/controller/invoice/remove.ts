import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const invoiceParamsSchema = z.object({
    invoiceId: z.string(),
  })

  const { invoiceId } = invoiceParamsSchema.parse(request.params)

  if (!invoiceId) {
    return reply.status(400).send({ error: "Missing invoiceId" })
  } else {
    await prisma.invoiceItems.deleteMany({ where: { invoice_id: invoiceId } })
    await prisma.invoice.delete({ where: { id: invoiceId } })
    return reply.status(201).send()
  }
}
