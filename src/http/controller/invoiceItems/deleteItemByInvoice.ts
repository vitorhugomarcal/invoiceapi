import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function deleteItemByInvoice(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const invoiceItemsParamsSchema = z.object({
    itemId: z.string(),
  })

  const { itemId } = invoiceItemsParamsSchema.parse(request.params)

  if (!itemId) {
    return reply.status(400).send({ error: "Missing itemId" })
  } else {
    await prisma.invoiceItems.delete({
      where: {
        id: itemId,
      },
    })
    return reply.status(201).send()
  }
}
