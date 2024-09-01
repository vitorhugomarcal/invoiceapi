import { FastifyRequest, FastifyReply } from "fastify"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateItemParamsSchema = z.object({
    name: z.string().optional(),
    price: z.number().min(0).optional(),
    description: z.string().optional(),
    unit: z.string().optional(),
  })

  const itemParamsSchema = z.object({
    itemId: z.string(),
  })

  const { itemId } = itemParamsSchema.parse(request.params)

  const { name, price, description, unit } = updateItemParamsSchema.parse(
    request.body
  )

  if (!itemId) {
    return reply.status(400).send({ error: "Missing userId" })
  } else {
    const user = await prisma.item.findUnique({
      where: { id: itemId },
    })
    if (!user) {
      return reply.status(404).send({ error: "User not found" })
    } else {
      await prisma.item.update({
        where: { id: itemId },
        data: {
          name,
          price,
          description,
          unit,
        },
      })
    }
  }

  return reply.status(204).send()
}
