import { FastifyInstance } from "fastify"
import { register } from "./register"
import { getClientsByCompany } from "./getClientsByCompany"
import { getClient } from "./getClient"
import { update } from "./update"
import { remove } from "./remove"

export async function clientRoutes(app: FastifyInstance) {
  app.post("/client/:companyId", register)
  app.get("/clients/:companyId", getClientsByCompany)
  app.get("/clients/client/:id", getClient)
  app.put("/client/:id", update)
  app.delete("/client/:clientId", remove)
}
