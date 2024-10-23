import { prisma } from "@/lib/prisma"
import type { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function inviteUserToCompany(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const inviteUserSchema = z.object({
    email: z.string().email(),
  })

  const { email } = inviteUserSchema.parse(request.body)

  const companyParamsSchema = z.object({
    userId: z.string(),
    companyId: z.string(),
  })

  const { userId, companyId } = companyParamsSchema.parse(request.params)

  const user = await prisma.user.findUnique({ where: { id: userId } })

  if (!user) {
    return reply.status(404).send({ error: "User not found" })
  }

  const company = await prisma.company.findUnique({ where: { id: companyId } })

  if(!company) {
    return reply.status(404).send({ error: "Company not found" })
  }

  const existingInvite = await prisma.pendingUser.findUnique({
    where: { email, company_id: companyId },
  })
  if (existingInvite) {
    throw new Error("Usuário já foi convidado.")
  }

  const invitedUser = await prisma.pendingUser.create({
    data: {
      email,
      company_id: companyId,
      invited_by: userId,
    },
  })

  return invitedUser
}
