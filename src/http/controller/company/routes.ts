import { FastifyInstance } from "fastify"
import { register } from "./register"
import { getCompanyByEmail } from "./getCompanyByEmail"
import { update } from "./update"

export async function companyRoutes(app: FastifyInstance) {
  app.post("/company/:email", register)
  app.get("/company/:email", getCompanyByEmail)
  app.put("/company/:email", update)
}
