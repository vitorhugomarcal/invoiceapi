import { prisma } from "@/lib/prisma"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    invoice_number: z.string().optional(),
    status: z.string().optional(),
    notes: z.string().optional(),
    sub_total: z.number().optional(),
    total: z.number().optional(),
  })

  const { invoice_number, status, notes, sub_total, total } =
    registerBodySchema.parse(request.body)

  const invoiceParamsSchema = z.object({
    clientId: z.string(),
  })

  const { clientId } = invoiceParamsSchema.parse(request.params)

  const client = await prisma.client.findUnique({ where: { id: clientId } })
  if (!client) {
    return reply.status(404).send({ error: "Client not found" })
  }
  const invoice = await prisma.invoice.create({
    data: {
      user_id: client.user_id,
      client_id: client.id,
      invoice_number,
      status,
      notes,
      sub_total,
      total,
    },
  })

  return invoice
}
