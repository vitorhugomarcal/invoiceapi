import { prisma } from "@/lib/prisma"
import { makeGetUserProfileEmailUseCase } from "@/use-cases/factories/make-user-profile-email-use-case"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function getCompanyByOwner(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const companyParamsSchema = z.object({
    userId: z.string(),
  })

  const { userId } = companyParamsSchema.parse(request.params)

  if (!userId) {
    return reply.status(400).send({ error: "Missing userId" })
  } else {
    const company = await prisma.company.findFirst({
      where: {
        company_name: userId
      },
    })
    return company
  }
}
