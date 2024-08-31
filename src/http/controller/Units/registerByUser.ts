import { prisma } from "@/lib/prisma"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function registerByUser(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const registerBodySchema = z.object({
    name: z.string(),
  })

  const { name } = registerBodySchema.parse(request.body)

  const itemParamsSchema = z.object({
    userId: z.string(),
  })

  const { userId } = itemParamsSchema.parse(request.params)

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    return reply.status(404).send({ error: "User not found" })
  }

  const unit = await prisma.unitTypeCustom.create({
    data: {
      user_id: user.id,
      name,
    },
  })

  return unit
}
