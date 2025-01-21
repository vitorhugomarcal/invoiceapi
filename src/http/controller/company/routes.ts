import { FastifyInstance } from "fastify"
import { register } from "./register"
import { getCompanyByUsers } from "./getCompanyByUsers"
import { update } from "./update"
import { getCompanyByCNPJ } from "./getCompanyByCNPJ"
import { inviteUserToCompany } from "./inviteUserToCompany"
import { removeInviteToCompany } from "./removeInviteToCompany"

export async function companyRoutes(app: FastifyInstance) {
  app.post("/company/:userId", register)
  
  app.post("/company/invite/:companyId/:userId", inviteUserToCompany)
  
  app.get("/company/:userId", getCompanyByUsers)
  app.get("/company/cnpj/:cnpj", getCompanyByCNPJ)
  
  app.put("/company/:userId", update)
  
  app.delete("/company/invite/:inviteId", removeInviteToCompany)
}
