import { prisma } from "@/lib/prisma"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    company_name: z.string(),
    cnpj: z.string(),
    phone: z.string(),
    cep: z.string(),
    address: z.string(),
    address_number: z.string(),
    neighborhood: z.string(),
    city: z.string(),
    state: z.string(),
  })

  const {
    company_name,
    cnpj,
    phone,
    state,
    city,
    cep,
    address_number,
    address,
    neighborhood,
  } = registerBodySchema.parse(request.body)

  const userParamsSchema = z.object({
    userId: z.string(),
  })

  const { userId } = userParamsSchema.parse(request.params)

  const existingCompany = await prisma.company.findUnique({ where: { cnpj } })

  if (existingCompany) {
    return reply.status(409).send({ error: "Company already exists" })
  } 
  
    const company = await prisma.company.create({
      data: {
        owner_id: userId,
        company_name,
        cnpj,
        phone,
        cep,
        address,
        address_number,
        neighborhood,
        city,
        state,
      },
    })

    if (company) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          company_id: company.id,
        },
      })
    }

  return reply.status(201).send()
}
