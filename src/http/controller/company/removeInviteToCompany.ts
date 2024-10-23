import { prisma } from "@/lib/prisma"
import type { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function removeInviteToCompany(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const companyParamsSchema = z.object({
    inviteId: z.string(),
  })

  const { inviteId } = companyParamsSchema.parse(request.params)


  const invite = await prisma.pendingUser.findUnique({ where: { id: inviteId } })

  if (!invite) {
    return reply.status(404).send({ error: "Invite not found" })
  }

  await prisma.pendingUser.delete({
    where: { id: inviteId },
  })

  return reply.status(200).send()
}
