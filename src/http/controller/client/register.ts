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
    email: z.string(),
  })

  const { email } = userParamsSchema.parse(request.params)

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return reply.status(404).send({ error: "User not found" })
  }

  // Agora verifica se o cliente já existe para o usuário específico
  const existingClient = await prisma.client.findFirst({
    where: {
      user_id: user.id,
      AND: [{ cpf: cpf ?? undefined }, { cnpj: cnpj ?? undefined }],
    },
  })

  if (existingClient) {
    console.log("Client already exists for this user")
    return reply
      .status(409)
      .send({ error: "Client already exists for this user" })
  }

  await prisma.client.create({
    data: {
      user_id: user.id,
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
  return reply.status(201).send()
}
