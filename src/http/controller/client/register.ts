import { prisma } from "@/lib/prisma"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    type: z.string(),
    cpf: z.string().optional(),
    company_name: z.string().optional(),
    email_address: z.string(),
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
    email_address,
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
    companyId: z.string(),
  })

  const { companyId } = userParamsSchema.parse(request.params)

  const company = await prisma.company.findUnique({ where: { id: companyId } })

  if (!company) {
    return reply.status(404).send({ error: "Company not found" })
  }
  // Agora verifica se o cliente já existe para o usuário específico
  const existingClient = await prisma.client.findFirst({
    where: {
      company_id: company.id,
      AND: [{ cpf: cpf ?? undefined }, { cnpj: cnpj ?? undefined }],
    },
  })

  if (existingClient) {
    console.log("Client already exists for this user")
    return reply
      .status(409)
      .send({ error: "Client already exists for this user" })
  }

  const client = await prisma.client.create({
    data: {
      company_id: company.id,
      type,
      cpf,
      company_name,
      email_address,
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

  return reply.status(201).send(client)
}
