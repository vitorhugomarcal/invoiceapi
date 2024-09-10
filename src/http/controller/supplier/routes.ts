import { FastifyInstance } from "fastify"

import { update } from "./update"
import { register } from "./register"
import { getSupplierByUser } from "./getSupplierByUser"
import { getSupplierByCNPJ } from "./getSupplierByCNPJ"

export async function supplierRoutes(app: FastifyInstance) {
  app.put("/supplier/:id", update)
  app.post("/supplier/:userId", register)
  app.get("/supplier/:cnpj", getSupplierByCNPJ)
  app.get("/supplier/:userId", getSupplierByUser)
}
