// src/http/controllers/users/profile.ts
import { FastifyRequest, FastifyReply } from "fastify"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Schema para validação da resposta
const profileResponseSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().email(),
  role: z.string().nullable(),
  type: z.string().nullable(),
  company_id: z.string().nullable(),
  createdAt: z.string(),
})

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { userId } = request.user

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        type: true,
        company_id: true,
        createdAt: true,
      },
    })

    if (!user) {
      return reply.status(404).send({
        code: "USER_NOT_FOUND",
        message: "Usuário não encontrado.",
      })
    }

    // Validação da resposta
    const validatedResponse = profileResponseSchema.parse({
      ...user,
      createdAt: user.createdAt.toISOString(),
    })

    return reply.status(200).send({
      user: validatedResponse,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        code: "VALIDATION_ERROR",
        message: "Erro na validação dos dados.",
        errors: error.errors,
      })
    }

    console.error("Erro ao buscar perfil:", error)
    return reply.status(500).send({
      code: "INTERNAL_ERROR",
      message: "Erro interno do servidor.",
    })
  }
}
