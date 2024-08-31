import { FastifyInstance } from "fastify"
import { register } from "./register"
import { getClientsByEmail } from "./getClientsByEmail"
import { getClient } from "./getClient"
import { update } from "./update"
import { remove } from "./remove"

export async function clientRoutes(app: FastifyInstance) {
  app.post("/client/:email", register)
  app.get("/clients/:email", getClientsByEmail)
  app.get("/clients/client/:id", getClient)
  app.put("/client/:id", update)
  app.delete("/client/:clientId", remove)
}
