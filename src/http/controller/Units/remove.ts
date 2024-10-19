import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const unitParamsSchema = z.object({
    unitId: z.string(),
  })

  const { unitId } = unitParamsSchema.parse(request.params)

  if (!unitId) {
    return reply.status(400).send({ error: "Missing unitId" })
  }

  await prisma.unitTypeCustom.delete({ where: { id: unitId } })
  return reply.status(201).send()
}
