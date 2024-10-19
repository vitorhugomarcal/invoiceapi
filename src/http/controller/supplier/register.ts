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
    email_address: z.string().email(),
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
    email_address,
    address,
    neighborhood,
  } = registerBodySchema.parse(request.body)

  const supplierParamsSchema = z.object({
    companyId: z.string(),
  })

  const { companyId } = supplierParamsSchema.parse(request.params)

  const existingSupplier = await prisma.supplier.findUnique({ where: { cnpj } })

  const company = await prisma.company.findUnique({ where: { id: companyId } })
  if (!company) {
    return reply.status(404).send({ error: "Company not found" })
  }

  if (existingSupplier) {
    const supplierUserExists = await prisma.supplierUser.findUnique({
      where: {
        supplier_id_company_id: {
          supplier_id: existingSupplier.id,
          company_id: company.id,
        },
      },
    })
    if (supplierUserExists) {
      return reply
        .status(409)
        .send({ error: "Supplier is already associated with this user" })
    }
    await prisma.supplierUser.create({
      data: {
        supplier_id: existingSupplier.id,
        company_id: company.id,
      },
    })
    return reply
      .status(200)
      .send({ message: "Supplier associated with the user" })
  } else {
    const newSupplier = await prisma.supplier.create({
      data: {
        company_name,
        cnpj,
        phone,
        cep,
        address,
        address_number,
        email_address,
        neighborhood,
        city,
        state,
      },
    })

    await prisma.supplierUser.create({
      data: {
        supplier_id: newSupplier.id,
        company_id: company.id,
      },
    })

    return reply
      .status(201)
      .send({ message: "Supplier created and associated with the user" })
  }
}
