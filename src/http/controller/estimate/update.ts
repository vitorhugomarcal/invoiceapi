import { FastifyRequest, FastifyReply } from "fastify"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateEstimateParamsSchema = z.object({
    estimate_number: z.string().optional(),
    status: z.string().optional(),
    notes: z.string().optional(),
  })

  const estimateParamsSchema = z.object({
    estimateId: z.string(),
  })

  const { estimateId } = estimateParamsSchema.parse(request.params)

  const { estimate_number, status, notes } = updateEstimateParamsSchema.parse(
    request.body
  )

  if (!estimateId) {
    return reply.status(400).send({ error: "Missing userId" })
  } 

  const estimate = await prisma.estimate.findUnique({
    where: { id: estimateId },
  })
  
  if (!estimate) {
    return reply.status(404).send({ error: "User not found" })
  } 
  const estimateUpdated = await prisma.estimate.update({
        where: { id: estimateId },
        data: {
          estimate_number,
          status,
          notes,
        },
      })
      
  return reply.status(204).send(estimateUpdated)
}
