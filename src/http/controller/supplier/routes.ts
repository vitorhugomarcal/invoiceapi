import { FastifyInstance } from "fastify"

import { update } from "./update"
import { register } from "./register"
import { getSupplierByUser } from "./getSupplierByUser"
import { getSupplierByCNPJ } from "./getSupplierByCNPJ"
import { getSupplier } from "./getSupplier"
import { remove } from "./remove"
import { registerUser } from "./registerUser"

export async function supplierRoutes(app: FastifyInstance) {
  app.put("/supplier/:id", update)
  app.post("/supplier/:userId", register)
  app.post("/supplier/addUser/:supplierId", registerUser)
  app.get("/supplier/:id/:userId", getSupplier)
  app.delete("/supplier/:supplierId/:userId", remove)
  app.get("/supplier/cnpj/:cnpj", getSupplierByCNPJ)
  app.get("/supplier/user/:userId", getSupplierByUser)
}
