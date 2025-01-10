import jwt from "jsonwebtoken"
import { FastifyReply, FastifyRequest } from "fastify"
import { env } from "@/env"
import { app } from "@/app"

// Erros personalizados
class UnauthorizedError extends Error {
  constructor() {
    super("Usuário não autorizado")
    this.name = "UnauthorizedError"
  }
}

const JWT_SECRET_KEY = env.JWT_SECRET

// Plugin de autenticação
export async function authentication() {
  app.decorate("getCurrentUser", async (request: FastifyRequest) => {
    const token = request.cookies.auth

    console.log("TOKEN =>", token)

    if (!token) {
      throw new UnauthorizedError()
    }

    try {
      const payload = jwt.verify(token, JWT_SECRET_KEY) as { sub: string }

      console.log("PAYLOAD =>", payload)

      return payload
    } catch (error) {
      throw new UnauthorizedError()
    }
  })

  // Função para assinar JWT e definir cookie
  app.decorate(
    "signUser",
    async (reply: FastifyReply, payload: { sub: string }) => {
      const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "7d" })
      reply.setCookie("auth", token, {
        httpOnly: true,
        maxAge: 7 * 86400, // 7 dias
        path: "/",
      })
    }
  )

  // Função para remover o cookie de autenticação
  app.decorate("signOut", (reply: FastifyReply) => {
    reply.clearCookie("auth", { path: "/" })
  })

  // Tratamento de erros personalizados
  app.setErrorHandler((error, request, reply) => {
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
  interface FastifyInstance {
    getCurrentUser: (request: FastifyRequest) => Promise<{
      sub: string
    }>
    signUser: (reply: FastifyReply, payload: { sub: string }) => Promise<void>
    signOut: (reply: FastifyReply) => void
  }
}
