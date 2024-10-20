import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function getCompanyByUsers(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const companyParamsSchema = z.object({
    userId: z.string(),
  })

  try {
    const { userId } = companyParamsSchema.parse(request.params)

    const company = await prisma.company.findFirst({
      where: {
        user: {
          some: {
            id: userId,
          },
        },
      },
    })
    if (!company) {
      return reply.status(404).send({ error: "Company not found" })
    }
    return reply.status(200).send(company)
  } catch (error) {
    console.error("Error fetching company:", error)
    return reply.status(500).send({ error: "Internal Server Error" })
  }
}
