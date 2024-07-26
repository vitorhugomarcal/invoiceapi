import { prisma } from "@/lib/prisma"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    type: z.string(),
    cpf: z.string().optional(),
    company_name: z.string().optional(),
    emailAddress: z.string(),
    address_number: z.string(),
    name: z.string(),
    cnpj: z.string().optional(),
    phone: z.string(),
    cep: z.string(),
    address: z.string(),
    neighborhood: z.string(),
    city: z.string(),
    state: z.string(),
  })

  const {
    type,
    cpf,
    company_name,
    emailAddress,
    name,
    cnpj,
    phone,
    cep,
    address,
    address_number,
    neighborhood,
    city,
    state,
  } = registerBodySchema.parse(request.body)

  const userParamsSchema = z.object({
    email: z.string(),
  })

  const { email } = userParamsSchema.parse(request.params)

  const existingClientCPF = await prisma.client.findFirst({ where: { cpf } })
  const existingClientCNPJ = await prisma.client.findFirst({ where: { cnpj } })

  if (existingClientCPF || existingClientCNPJ) {
    return reply.status(409).send({ error: "Client already exists" })
  } else {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return reply.status(404).send({ error: "User not found" })
    }
    await prisma.client.create({
      data: {
        user_id: user.id,
        type,
        cpf,
        company_name,
        emailAddress,
        name,
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
  }

  return reply.status(201).send()
}
