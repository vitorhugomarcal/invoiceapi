// src/http/middlewares/verify-jwt.ts
import { FastifyReply, FastifyRequest } from "fastify"

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Tenta pegar o token do cookie
    const token = request.cookies.auth_token

    console.log("TOKEN =>", token)

    if (!token) {
      return reply.status(401).redirect("/sign-in")
    }

    try {
      await request.jwtVerify()
    } catch (error) {
      // Se o token for inválido, limpa o cookie e redireciona
      reply.clearCookie("auth_token", {
        path: "/sign-in",
      })
      return reply.status(401).redirect("/sign-in")
    }
  } catch (err) {
    return reply.status(401).redirect("/sign-in")
  }
}
