import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function getUserById(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userParamsSchema = z.object({
    userId: z.string(),
  })

  const { userId } = userParamsSchema.parse(request.params)

  if (!userId) {
    return reply.status(400).send({ error: "Missing userId" })
  } else {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })
    return user
  }
}
