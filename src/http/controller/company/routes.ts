import { FastifyInstance } from "fastify"
import { register } from "./register"
import { getCompanyByEmail } from "./getCompanyByEmail"
import { update } from "./update"
import { getCompanyByCNPJ } from "./getCompanyByCNPJ"

export async function companyRoutes(app: FastifyInstance) {
  app.post("/company/:email", register)
  app.get("/company/:email", getCompanyByEmail)
  app.get("/company/cnpj/:cnpj", getCompanyByCNPJ)
  app.put("/company/:email", update)
}
