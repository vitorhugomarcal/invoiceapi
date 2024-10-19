import { prisma } from "@/lib/prisma"
import type { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function inviteUserToCompany(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const inviteUserSchema = z.object({
    email: z.string().email(),
    company_id: z.string(),
    invited_by: z.string(),
  })

  const { email, company_id, invited_by } = inviteUserSchema.parse(request.body)

  const companyParamsSchema = z.object({
    userId: z.string(),
  })

  const { userId } = companyParamsSchema.parse(request.params)

  if (!userId) {
    return reply.status(400).send({ error: "Missing userId" })
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })

  if (!user) {
    return reply.status(404).send({ error: "User not found" })
  }

  const existingInvite = await prisma.pendingUser.findUnique({
    where: { email, company_id },
  })
  if (existingInvite) {
    throw new Error("Usuário já foi convidado.")
  }

  const invitedUser = await prisma.pendingUser.create({
    data: {
      email,
      company_id,
      invited_by,
    },
  })

  return invitedUser
}
