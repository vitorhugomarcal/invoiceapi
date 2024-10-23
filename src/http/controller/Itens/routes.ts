import { FastifyInstance } from "fastify"

import { update } from "./update"
import { register } from "./register"
import { deleteItem } from "./deleteItem"
import { getByInvoice } from "./getByInvoice"
import { getByCompany } from "./getByCompany"

export async function ItensRoutes(app: FastifyInstance) {
  app.post("/items/:companyId", register)

  app.get("/items/:invoiceId", getByInvoice)
  app.get("/items/company/:companyId", getByCompany)

  app.put("/items/:itemId", update)

  app.delete("/items/:itemId", deleteItem)
}
