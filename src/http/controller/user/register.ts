import { prisma } from "@/lib/prisma"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    email: z.string().email(),
  })

  const { email } = registerBodySchema.parse(request.body)

  const existingUser = await prisma.user.findFirst({ where: { email } })

  if (existingUser) {
    return
  } else {
    await prisma.user.create({
      data: {
        email,
      },
    })
  }

  return reply.status(201).send()
}
