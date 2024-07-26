import { FastifyInstance } from "fastify"
import { register } from "./register"
import { getClientsByEmail } from "./getClientsByEmail"
import { getClient } from "./getClient"

export async function clientRoutes(app: FastifyInstance) {
  app.post("/client/:email", register)
  app.get("/clients/:email", getClientsByEmail)
  app.get("/clients/client/:id", getClient)
}
