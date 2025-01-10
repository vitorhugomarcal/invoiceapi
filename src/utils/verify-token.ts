// src/utils/verify-token.ts
import jwt from "jsonwebtoken"
import { env } from "@/env"

interface TokenPayload {
  sub: string
  email: string
  iat: number
  exp: number
}

export function verifyToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload
    return decoded
  } catch (error) {
    throw new Error("Invalid token")
  }
}
