import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function deleteItem(request: FastifyRequest, reply: FastifyReply) {
  const invoiceItemsParamsSchema = z.object({
    itemId: z.string(),
  })

  const { itemId } = invoiceItemsParamsSchema.parse(request.params)

  if (!itemId) {
    return reply.status(400).send({ error: "Missing itemId" })
  } else {
    await prisma.item.delete({
      where: {
        id: itemId,
      },
    })
    return reply.status(201).send()
  }
}
