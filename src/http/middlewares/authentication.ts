import jwt from "jsonwebtoken"
import { FastifyReply, FastifyRequest, FastifyInstance } from "fastify"
import { env } from "@/env"
import { z } from "zod"

// Erros personalizados
class UnauthorizedError extends Error {
  constructor() {
    super("Usuário não autorizado")
    this.name = "UnauthorizedError"
  }
}

export async function authentication(fastify: FastifyInstance) {
  // Método para obter o usuário atual
  fastify.decorate("getCurrentUser", async (request: FastifyRequest) => {
    const token = request.cookies.auth
    console.log("Token =>", token)

    if (!token) {
      throw new UnauthorizedError()
    }

    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string }

      console.log("PAYLOAD =>", payload)

      return payload
    } catch (error) {
      throw new UnauthorizedError()
    }
  })

  // Método para assinar o JWT e definir cookie
  fastify.decorateReply("signUser", async function (payload: { sub: string }) {
    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" })

    console.log("Token2 =>", token)

    this.setCookie("auth", token, {
      httpOnly: true,
      maxAge: 7 * 86400, // 7 dias
      path: "/",
    })
  })

  // Método para limpar o cookie de autenticação
  fastify.decorateReply("signOut", function () {
    this.clearCookie("auth", { path: "/" })
  })

  // Tratamento de erros personalizados
  fastify.setErrorHandler((error, request, reply) => {
    if (error instanceof UnauthorizedError) {
      reply.status(401).send({ code: "UNAUTHORIZED", message: error.message })
    } else {
      reply
        .status(500)
        .send({ code: "INTERNAL_SERVER_ERROR", message: error.message })
    }
  })
}

// Declarações de tipo para o Fastify
declare module "fastify" {
  interface FastifyReply {
    signUser: (payload: { sub: string }) => Promise<void>
    signOut: () => void
  }
  interface FastifyInstance {
    getCurrentUser: (request: FastifyRequest) => Promise<{ sub: string }>
  }
}
