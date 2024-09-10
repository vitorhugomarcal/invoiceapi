import { FastifyInstance } from "fastify"

import { update } from "./update"
import { register } from "./register"
import { getSupplierByUser } from "./getSupplierByUser"
import { getSupplierByCNPJ } from "./getSupplierByCNPJ"
import { getSupplier } from "./getSupplier"

export async function supplierRoutes(app: FastifyInstance) {
  app.put("/supplier/:id", update)
  app.post("/supplier/:userId", register)
  app.get("/supplier/:id", getSupplier)
  app.get("/supplier/cnpj/:cnpj", getSupplierByCNPJ)
  app.get("/supplier/user/:userId", getSupplierByUser)
}
