import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function getAll(request: FastifyRequest, reply: FastifyReply) {
  const itensParamsSchema = z.object({
    companyId: z.string(),
  })

  const { companyId } = itensParamsSchema.parse(request.params)

  if (!companyId) {
    return reply.status(400).send({ error: "Missing userId" })
  }
  const unitsCustom = await prisma.unitTypeCustom.findMany({
    where: { company_id: companyId },
  })
  const unitsDefault = await prisma.unitType.findMany()

  const allUnits = [...unitsCustom, ...unitsDefault]

  return allUnits
}
