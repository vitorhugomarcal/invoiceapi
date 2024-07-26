import { FastifyRequest, FastifyReply } from "fastify"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export async function updateRole(request: FastifyRequest, reply: FastifyReply) {
  const VALUES = ["MASTER", "BASIC"] as const
  const updateUsersParamsSchema = z.object({
    role: z.enum(VALUES),
  })

  const userParamsSchema = z.object({
    userId: z.string(),
  })

  const { userId } = userParamsSchema.parse(request.params)

  const { role } = updateUsersParamsSchema.parse(request.body)

  if (!userId) {
    return reply.status(400).send({ error: "Missing userId" })
  } else {
    await prisma.user.update({
      where: { id: userId },
      data: {
        role,
      },
    })
  }

  return reply.status(200).send()
}
