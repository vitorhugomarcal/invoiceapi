import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function getAll(request: FastifyRequest, reply: FastifyReply) {
  const itensParamsSchema = z.object({
    userId: z.string(),
  })

  const { userId } = itensParamsSchema.parse(request.params)

  if (!userId) {
    return reply.status(400).send({ error: "Missing userId" })
  } else {
    const unitsCustom = await prisma.unitTypeCustom.findMany({
      where: { user_id: userId },
    })
    const unitsDefault = await prisma.unitType.findMany()

    const allUnits = [...unitsCustom, ...unitsDefault]

    return allUnits
  }
}
