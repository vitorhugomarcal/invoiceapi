import { prisma } from "@/lib/prisma"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import dayjs from "dayjs"

export async function getInvoiceByCompanyApproved(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const invoiceParamsSchema = z.object({
    companyId: z.string(),
  })

  const { companyId } = invoiceParamsSchema.parse(request.params)

  if (!companyId) {
    return reply.status(400).send({ error: "Missing companyId" })
  }

  const invoices = await prisma.invoice.findMany({
    where: {
      company_id: companyId,
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
    const date = dayjs(invoice.createdAt)
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
