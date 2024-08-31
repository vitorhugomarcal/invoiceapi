import { prisma } from "@/lib/prisma"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
  })

  const { name } = registerBodySchema.parse(request.body)

  const alreadyExists = await prisma.unitType.findFirst({
    where: { name },
  })

  if (alreadyExists) {
    return reply.status(400).send({ error: "Unit type already exists" })
  }

  await prisma.unitType.create({
    data: {
      name,
    },
  })

  const units = await prisma.unitType.findMany()

  return units
}
