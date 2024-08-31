import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import dayjs from "dayjs"

export async function getInvoiceByUserApproved(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const invoiceParamsSchema = z.object({
    userId: z.string(),
  })

  const { userId } = invoiceParamsSchema.parse(request.params)

  if (!userId) {
    return reply.status(400).send({ error: "Missing userId" })
  }

  const invoices = await prisma.invoice.findMany({
    where: {
      user_id: userId,
      status: "APPROVED",
    },
  })

  // Define all possible months
  const allMonths = [
    { month: "jan", year: 2024, total: 0 },
    { month: "fev", year: 2024, total: 0 },
    { month: "mar", year: 2024, total: 0 },
    { month: "abr", year: 2024, total: 0 },
    { month: "mai", year: 2024, total: 0 },
    { month: "jun", year: 2024, total: 0 },
    { month: "jul", year: 2024, total: 0 },
    { month: "ago", year: 2024, total: 0 },
    { month: "set", year: 2024, total: 0 },
    { month: "out", year: 2024, total: 0 },
    { month: "nov", year: 2024, total: 0 },
    { month: "dez", year: 2024, total: 0 },
  ]

  // Aggregate totals by month
  const aggregatedInvoices = invoices.reduce((acc, invoice) => {
    const date = dayjs(invoice.created_at)
    const month = date.format("MMM").toLowerCase() // e.g., "aug" for August
    const year = date.year()

    const existing = acc.find(
      (item) => item.month === month && item.year === year
    )

    if (existing) {
      existing.total += Number(invoice.total)
    }

    return acc
  }, allMonths)

  return aggregatedInvoices
}
