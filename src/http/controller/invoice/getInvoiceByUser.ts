import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function getInvoiceByUser(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const invoiceParamsSchema = z.object({
    userId: z.string(),
  })

  const { userId } = invoiceParamsSchema.parse(request.params)

  if (!userId) {
    return reply.status(400).send({ error: "Missing userId" })
  } else {
    const invoice = await prisma.invoice.findMany({
      where: {
        user_id: userId,
      },
      include: {
        client: true,
      },
      orderBy: {
        created_at: "desc",
      },
    })
    return invoice
  }
}
