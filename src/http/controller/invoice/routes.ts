import { FastifyInstance } from "fastify"

import { update } from "./update"
import { remove } from "./remove"
import { register } from "./register"
import { getByInvoice } from "./getByInvoice"
import { getInvoiceByUser } from "./getInvoiceByUser"
import { getInvoiceByUserApproved } from "./getInvoiceByUserApproved"

export async function invoiceRoutes(app: FastifyInstance) {
  app.post("/invoice/:clientId", register)
  app.put("/invoice/:invoiceId", update)
  app.delete("/invoice/:invoiceId", remove)
  app.get("/invoice/:invoiceId", getByInvoice)
  app.get("/invoices/user/:userId", getInvoiceByUser)
  app.get("/invoices/user/approved/:userId", getInvoiceByUserApproved)
}
