import { prisma } from "@/lib/prisma"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    price: z.number().min(0),
    description: z.string().optional(),
    unit: z.string(),
  })

  const { name, price, unit, description } = registerBodySchema.parse(
    request.body
  )

  const itemParamsSchema = z.object({
    companyId: z.string(),
  })

  const { companyId } = itemParamsSchema.parse(request.params)

  const company = await prisma.company.findUnique({ where: { id: companyId } })
  if (!company) {
    return reply.status(404).send({ error: "User not found" })
  }

  const item = await prisma.item.create({
    data: {
      company_id: company.id,
      name,
      price,
      unit,
      description: description || "",
    },
  })

  return item
}
