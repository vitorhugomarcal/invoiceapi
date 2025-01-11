import { FastifyInstance } from "fastify"
import { register } from "./register"
import { getUserById } from "./getUserById"
import { update } from "./update"
import { updateRole } from "./updateRole"
import { verifyJWT } from "@/http/middlewares/verify-jwt"
import { authenticate } from "./authenticate"
import { refresh } from "./refresh"
import { remove } from "./remove"
import { profile } from "./profile"
import { updateType } from "./updateType"
import { createMagicAuth } from "./createMagicAuth"
import { getMagicAuth } from "./getMagicAuth"

export async function userRoutes(app: FastifyInstance) {
  app.post("/users", register)
  app.post("/sessions", authenticate)
  app.post("/token/refresh", refresh)

  app.post("/auth/magic-link", createMagicAuth)
  app.get("/auth/verify", getMagicAuth)

  app.get("/me", { preHandler: [verifyJWT] }, profile)
  app.get("/users/:userId", { onRequest: [verifyJWT] }, getUserById)
  app.put("/users/:userId", update)
  app.patch("/users/role/:userId", updateRole)
  app.patch("/users/type/:userId", updateType)
  app.delete("/users/:userId", remove)
  // app.delete('/users/:userId', { onRequest: [verifyJWT] }, remove)
  // app.get('/users/:userId', { onRequest: [verifyJWT] }, show)
}
