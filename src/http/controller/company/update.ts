import { FastifyRequest, FastifyReply } from "fastify"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateCompanyParamsSchema = z.object({
    company_name: z.string().optional(),
    cnpj: z.string().optional(),
    phone: z.string().optional(),
    cep: z.string().optional(),
    address: z.string().optional(),
    address_number: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    neighborhood: z.string().optional(),
  })

  const companyParamsSchema = z.object({
    userId: z.string(),
  })

  const { userId } = companyParamsSchema.parse(request.params)

  const {
    company_name,
    cnpj,
    phone,
    cep,
    address,
    address_number,
    city,
    state,
    neighborhood,
  } = updateCompanyParamsSchema.parse(request.body)

  if (!userId) {
    return reply.status(400).send({ error: "Missing email" })
  } else {
    const company = await prisma.company.findFirst({
      where: {
       owner_id: userId
      },
    })
    if (!company) {
      return reply.status(404).send({ error: "Company not found" })
    } else {
      await prisma.company.updateMany({
        where: { owner_id:  company.id },
        data: {
          company_name,
          cnpj,
          phone,
          cep,
          address,
          address_number,
          city,
          state,
          neighborhood,
        },
      })
    }
  }

  return reply.status(204).send()
}
