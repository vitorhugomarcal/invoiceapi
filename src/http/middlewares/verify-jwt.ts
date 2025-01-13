// src/http/middlewares/verifyJwt.ts
import { FastifyReply, FastifyRequest } from "fastify"
import { env } from "@/env"
import jwt from "jsonwebtoken"

interface JWTPayload {
  userId: string
  email: string
  sub: string
  role?: string
  type?: string
}

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Pega o token do cookie
    const token = request.cookies.auth_token

    console.log("TOKEN => ", token)

    if (!token) {
      return reply.status(401).send({ message: "Token não fornecido." })
    }

    // Verifica e decodifica o token
    const payload = jwt.verify(token, env.JWT_SECRET) as JWTPayload

    // Adiciona os dados do usuário ao request
    request.user = payload
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return reply.status(401).send({ message: "Token inválido." })
    }

    if (error instanceof jwt.TokenExpiredError) {
      return reply.status(401).send({ message: "Token expirado." })
    }

    return reply.status(500).send({ message: "Erro na verificação do token." })
  }
}
