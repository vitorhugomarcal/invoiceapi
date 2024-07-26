import { FastifyRequest, FastifyReply } from "fastify"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateUsersParamsSchema = z.object({
    name: z.string().optional(),
  })

  const userParamsSchema = z.object({
    userId: z.string(),
  })

  const { userId } = userParamsSchema.parse(request.params)

  const { name } = updateUsersParamsSchema.parse(request.body)

  if (!userId) {
    return reply.status(400).send({ error: "Missing userId" })
  } else {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })
    if (!user) {
      return reply.status(404).send({ error: "User not found" })
    } else {
      await prisma.user.update({
        where: { id: userId },
        data: {
          name,
        },
      })
    }
  }

  return reply.status(204).send()
}
