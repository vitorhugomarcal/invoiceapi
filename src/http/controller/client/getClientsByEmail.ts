import { prisma } from "@/lib/prisma"
import { makeGetUserProfileEmailUseCase } from "@/use-cases/factories/make-user-profile-email-use-case"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function getClientsByEmail(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const clientParamsSchema = z.object({
    email: z.string(),
  })

  const { email } = clientParamsSchema.parse(request.params)

  if (!email) {
    return reply.status(400).send({ error: "Missing email" })
  } else {
    const clients = await prisma.client.findMany({
      where: {
        user: {
          email,
        },
      },
    })
    return clients
  }
}
