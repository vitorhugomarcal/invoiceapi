import { prisma } from "@/lib/prisma"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
  })

  const { name, email } = registerBodySchema.parse(request.body)

  const invite = await prisma.pendingUser.findUnique({ where: { email } })

  if (!invite) {
    const existingUser = await prisma.user.findFirst({ where: { email } })
    if (!existingUser) {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          role: "MASTER",
        },
      })
      return reply.status(201).send(user)
    } else {
      return reply.status(400).send({ error: "Usuário já está cadastrado." })
    }
  } else {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        role: "BASIC",
        company_id: invite.company_id,
      },
    })

    await prisma.pendingUser.delete({ where: { email } })

    return reply.status(201).send(newUser)
  }
}
