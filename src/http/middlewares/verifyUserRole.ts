import { FastifyReply, FastifyRequest } from "fastify"

export function verifyUserRole(roleToVerify: "MASTER" | "BASIC") {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user

    if (role !== "MASTER") {
      return reply.status(401).send({ message: "Unauthorized." })
    }
  }
}
