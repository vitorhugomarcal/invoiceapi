import { prisma } from "@/lib/prisma"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    price: z.number().min(0),
    description: z.string().optional(),
    unit: z.string(),
  })

  const { name, price, unit, description } = registerBodySchema.parse(
    request.body
  )

  const itemParamsSchema = z.object({
    userId: z.string(),
  })

  const { userId } = itemParamsSchema.parse(request.params)

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    return reply.status(404).send({ error: "User not found" })
  }

  const item = await prisma.item.create({
    data: {
      user_id: user.id,
      name,
      price,
      unit,
      description: description || "",
    },
  })

  return item
}
