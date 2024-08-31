import { FastifyInstance } from "fastify"
import { register } from "./register"
import { getUserByEmail } from "./getUserByEmail"
import { update } from "./update"
import { updateRole } from "./updateRole"
import { verifyJWT } from "@/http/middlewares/verify-jwt"
import { authenticate } from "./authenticate"
import { refresh } from "./refresh"

export async function userRoutes(app: FastifyInstance) {
  app.post("/users", register)
  app.post("/sessions", authenticate)
  app.get("/users/email/:email", getUserByEmail)
  app.patch("/token/refresh", refresh)

  // app.get('/me', { onRequest: [verifyJWT] }, profile)
  app.put("/users/:userId", update)
  app.patch("/users/role/:userId", updateRole)
  // app.delete('/users/:userId', { onRequest: [verifyJWT] }, remove)
  // app.get('/users/:userId', { onRequest: [verifyJWT] }, show)
}
