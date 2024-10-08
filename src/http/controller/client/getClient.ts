import { prisma } from "@/lib/prisma"
import { makeGetUserProfileEmailUseCase } from "@/use-cases/factories/make-user-profile-email-use-case"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function getClient(request: FastifyRequest, reply: FastifyReply) {
  const clientParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = clientParamsSchema.parse(request.params)

  if (!id) {
    return reply.status(400).send({ error: "Missing id" })
  } else {
    const client = await prisma.client.findUnique({
      where: {
        id,
      },
      include: {
        Invoice: { orderBy: { created_at: "desc" } },
      },
    })
    return client
  }
}
