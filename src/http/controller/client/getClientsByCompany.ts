import { prisma } from "@/lib/prisma"
import { makeGetUserProfileEmailUseCase } from "@/use-cases/factories/make-user-profile-email-use-case"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function getClientsByCompany(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const clientParamsSchema = z.object({
    companyId: z.string(),
  })

  const { companyId } = clientParamsSchema.parse(request.params)

  if (!companyId) {
    return reply.status(400).send({ error: "Missing email" })
  }

  const clients = await prisma.client.findMany({
    where: {
      company_id: companyId,
    },
  })
  return clients
}
