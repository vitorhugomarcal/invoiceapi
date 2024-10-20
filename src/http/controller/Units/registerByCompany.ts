import { prisma } from "@/lib/prisma"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function registerByCompany(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const registerBodySchema = z.object({
    name: z.string(),
  })

  const { name } = registerBodySchema.parse(request.body)

  const itemParamsSchema = z.object({
    companyId: z.string(),
  })

  const { companyId } = itemParamsSchema.parse(request.params)

  const company = await prisma.company.findUnique({ where: { id: companyId } })
  if (!company) {
    return reply.status(404).send({ error: "User not found" })
  }

  const unit = await prisma.unitTypeCustom.create({
    data: {
      company_id: company.id,
      name,
    },
  })

  return unit
}
