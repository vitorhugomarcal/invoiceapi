import { FastifyRequest, FastifyReply } from "fastify"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export async function updateInvoiceItems(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const updateItemParamsSchema = z.object({
    name: z.string().optional(),
    price: z.number().min(0).optional(),
    quantity: z.number().min(0).optional(),
    total: z.number().min(0).optional(),
    unit: z.string().optional(),
  })

  const itemParamsSchema = z.object({
    itemInvoiceId: z.string(),
  })

  const { itemInvoiceId } = itemParamsSchema.parse(request.params)

  const { name, price, quantity, unit, total } = updateItemParamsSchema.parse(
    request.body
  )

  if (!itemInvoiceId) {
    return reply.status(400).send({ error: "Missing userId" })
  } else {
    const user = await prisma.invoiceItems.findUnique({
      where: { id: itemInvoiceId },
    })
    if (!user) {
      return reply.status(404).send({ error: "User not found" })
    } else {
      await prisma.invoiceItems.update({
        where: { id: itemInvoiceId },
        data: {
          name,
          price,
          quantity,
          unit,
          total,
        },
      })
    }
  }

  return reply.status(204).send()
}
