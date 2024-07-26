import { prisma } from "@/lib/prisma"
import { makeGetUserProfileEmailUseCase } from "@/use-cases/factories/make-user-profile-email-use-case"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function getCompanyByEmail(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const companyParamsSchema = z.object({
    email: z.string(),
  })

  const { email } = companyParamsSchema.parse(request.params)

  if (!email) {
    return reply.status(400).send({ error: "Missing email" })
  } else {
    const company = await prisma.company.findFirst({
      where: {
        user: {
          email,
        },
      },
    })
    return company
  }
}
