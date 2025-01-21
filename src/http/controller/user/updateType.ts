import { FastifyRequest, FastifyReply } from "fastify"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export async function updateType(request: FastifyRequest, reply: FastifyReply) {
  const VALUES = ["basic", "team", "pro"] as const
  const updateUsersParamsSchema = z.object({
    type: z.enum(VALUES),
  })

  const userParamsSchema = z.object({
    userId: z.string(),
  })

  const { userId } = userParamsSchema.parse(request.params)

  const { type } = updateUsersParamsSchema.parse(request.body)

  if (!userId) {
    return reply.status(400).send({ error: "Missing userId" })
  } else {
    await prisma.user.update({
      where: { id: userId },
      data: {
        type,
      },
    })
  }

  return reply.status(200).send()
}
