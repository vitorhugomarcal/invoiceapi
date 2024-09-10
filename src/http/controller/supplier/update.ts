import { FastifyRequest, FastifyReply } from "fastify"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateSupplierParamsSchema = z.object({
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

  const supplierParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = supplierParamsSchema.parse(request.params)

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
  } = updateSupplierParamsSchema.parse(request.body)

  if (!id) {
    return reply.status(400).send({ error: "Missing email" })
  } else {
    const supplier = await prisma.supplier.findFirst({
      where: {
        id,
      },
    })
    if (!supplier) {
      return reply.status(404).send({ error: "Company not found" })
    } else {
      await prisma.supplier.updateMany({
        where: { id },
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
