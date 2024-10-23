import { FastifyInstance } from "fastify"
import { register } from "./register"
import { getUserById } from "./getUserById"
import { update } from "./update"
import { updateRole } from "./updateRole"
import { verifyJWT } from "@/http/middlewares/verify-jwt"
import { authenticate } from "./authenticate"
import { refresh } from "./refresh"
import { remove } from "./remove"

export async function userRoutes(app: FastifyInstance) {
  app.post("/users", register)
  app.post("/sessions", authenticate)
  app.patch("/token/refresh", refresh)
  
  // app.get('/me', { onRequest: [verifyJWT] }, profile)
  app.get("/users/:userId", { onRequest: [verifyJWT] }, getUserById)
  app.put("/users/:userId", { onRequest: [verifyJWT] }, update)
  app.patch("/users/role/:userId", { onRequest: [verifyJWT] }, updateRole)
  app.delete("/users/:userId", { onRequest: [verifyJWT] }, remove)
  // app.delete('/users/:userId', { onRequest: [verifyJWT] }, remove)
  // app.get('/users/:userId', { onRequest: [verifyJWT] }, show)
}
