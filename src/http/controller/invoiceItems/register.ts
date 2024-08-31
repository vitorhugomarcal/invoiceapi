import { prisma } from "@/lib/prisma"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
    unit: z.string(),
    total: z.number(),
  })

  const { name, price, quantity, unit, total } = registerBodySchema.parse(
    request.body
  )

  const invoiceParamsSchema = z.object({
    invoiceId: z.string(),
  })

  const { invoiceId } = invoiceParamsSchema.parse(request.params)

  const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } })
  if (!invoice) {
    return reply.status(404).send({ error: "Client not found" })
  }
  await prisma.invoiceItems.create({
    data: {
      invoice_id: invoice.id,
      name,
      price,
      quantity,
      unit,
      total,
    },
  })

  return reply.status(201).send()
}
