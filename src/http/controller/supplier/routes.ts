import { FastifyInstance } from "fastify"
import { register } from "./register"
import { getSupplierByUser } from "./getSupplierByUser"
import { update } from "./update"

export async function supplierRoutes(app: FastifyInstance) {
  app.post("/supplier/:userId", register)
  app.get("/supplier/:userId", getSupplierByUser)
  app.put("/supplier/:id", update)
}
