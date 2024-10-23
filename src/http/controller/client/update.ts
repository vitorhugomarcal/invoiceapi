import { FastifyRequest, FastifyReply } from "fastify"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateClientParamsSchema = z.object({
    cpf: z.string().optional(),
    cnpj: z.string().optional(),
    company_name: z.string().optional(),
    name: z.string().optional(),
    address: z.string().optional(),
    address_number: z.string().optional(),
    cep: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    phone: z.string().optional(),
    neighborhood: z.string().optional(),
    email_address: z.string().email().optional(),
  })

  const clientParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = clientParamsSchema.parse(request.params)

  const {
    cpf,
    cnpj,
    company_name,
    name,
    address,
    address_number,
    cep,
    city,
    state,
    phone,
    neighborhood,
    email_address,
  } = updateClientParamsSchema.parse(request.body)

  if (!id) {
    return reply.status(400).send({ error: "Missing userId" })
  }

  const client = await prisma.client.findUnique({
    where: { id },
  })

  if (!client) {
    return reply.status(404).send({ error: "User not found" })
  }

  const updatedClient = await prisma.client.update({
    where: { id },
    data: {
      cpf,
      cnpj,
      company_name,
      name,
      address,
      address_number,
      cep,
      city,
      state,
      phone,
      neighborhood,
      email_address,
    },
  })
  return reply.status(204).send()
}
