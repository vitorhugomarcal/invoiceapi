import "@fastify/jwt"

declare module "@fastify/jwt" {
  export interface FastifyJWT {
    user: {
      userId: string
      email: string
      // role: "MASTER" | "BASIC"
    }
  }
}
