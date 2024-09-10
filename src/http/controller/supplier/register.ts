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

  const supplierParamsSchema = z.object({
    userId: z.string(),
  })

  const { userId } = supplierParamsSchema.parse(request.params)

  const existingSupplier = await prisma.supplier.findUnique({ where: { cnpj } })

  if (existingSupplier) {
    return reply.status(409).send({ error: "Supplier already exists" })
  } else {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return reply.status(404).send({ error: "User not found" })
    }
    await prisma.supplier.create({
      data: {
        user_id: user.id,
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
  }

  return reply.status(201).send()
}
