// src/types/fastify.d.ts
import "@fastify/jwt"

declare module "@fastify/jwt" {
  export interface FastifyJWT {
    payload: {
      sub: string
      role?: string
      type?: string
    }
    user: {
      userId: string
      email: string
      sub: string
      role?: string
      type?: string
    }
  }
}
