import { FastifyInstance } from "fastify"
import { register } from "./register"
import { getAll } from "./getAll"
import { registerByCompany } from "./registerByCompany"
import { remove } from "./remove"

export async function UnitsRoutes(app: FastifyInstance) {
  app.post("/units", register)
  app.post("/units/:companyId", registerByCompany)
  app.get("/units/:companyId", getAll)
  app.delete("/units/:unitId", remove)
}
