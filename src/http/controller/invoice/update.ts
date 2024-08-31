import { FastifyRequest, FastifyReply } from "fastify"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateUsersParamsSchema = z.object({
    invoice_number: z.string().optional(),
    status: z.string().optional(),
    notes: z.string().optional(),
    sub_total: z.number().optional(),
    total: z.number().optional(),
  })

  const invoiceParamsSchema = z.object({
    invoiceId: z.string(),
  })

  const { invoiceId } = invoiceParamsSchema.parse(request.params)

  const { invoice_number, status, notes, sub_total, total } =
    updateUsersParamsSchema.parse(request.body)

  if (!invoiceId) {
    return reply.status(400).send({ error: "Missing userId" })
  } else {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    })
    if (!invoice) {
      return reply.status(404).send({ error: "User not found" })
    } else {
      const invoice = await prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          invoice_number,
          status,
          notes,
          sub_total,
          total,
        },
      })
      return invoice
    }
  }

  // return reply.status(204).send()
}
