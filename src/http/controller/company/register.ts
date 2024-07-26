import { prisma } from "@/lib/prisma"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    cnpj: z.string(),
    phone: z.string(),
    cep: z.string(),
    address: z.string(),
    number: z.string(),
    neighborhood: z.string(),
    city: z.string(),
    state: z.string(),
  })

  const { name, cnpj, phone, state, city, cep, number, address, neighborhood } =
    registerBodySchema.parse(request.body)

  const userParamsSchema = z.object({
    email: z.string(),
  })

  const { email } = userParamsSchema.parse(request.params)

  const existingCompany = await prisma.company.findUnique({ where: { cnpj } })

  if (existingCompany) {
    return reply.status(409).send({ error: "Company already exists" })
  } else {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return reply.status(404).send({ error: "User not found" })
    }
    await prisma.company.create({
      data: {
        user_id: user.id,
        name,
        cnpj,
        phone,
        cep,
        address,
        number,
        neighborhood,
        city,
        state,
      },
    })
  }

  return reply.status(201).send()
}
