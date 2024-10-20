import { FastifyInstance } from "fastify"

import { update } from "./update"
import { register } from "./register"
import { getSupplierByCompany } from "./getSupplierByCompany"
import { getSupplierByCNPJ } from "./getSupplierByCNPJ"
import { getSupplier } from "./getSupplier"
import { remove } from "./remove"
import { registerCompany } from "./registerCompany"

export async function supplierRoutes(app: FastifyInstance) {
  app.post("/supplier/:companyId", register)
  app.post("/supplier/addUser/:supplierId", registerCompany)

  app.get("/supplier/:id/:companyId", getSupplier)
  app.get("/supplier/cnpj/:cnpj", getSupplierByCNPJ)
  app.get("/supplier/company/:companyId", getSupplierByCompany)

  app.put("/supplier/:id", update)

  app.delete("/supplier/:supplierId/:companyId", remove)
}
