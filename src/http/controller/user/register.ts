import { prisma } from "@/lib/prisma"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
  })

  const { name, email } = registerBodySchema.parse(request.body)

  const existingUser = await prisma.user.findFirst({ where: { email } })

  if (existingUser) {
    return
  } else {
    await prisma.user.create({
      data: {
        name,
        email,
      },
    })
  }

  return reply.status(201).send()
}
