import { FastifyInstance } from "fastify"

import { update } from "./update"
import { remove } from "./remove"
import { register } from "./register"
import { getByInvoice } from "./getByInvoice"
import { getInvoiceByCompany } from "./getInvoiceByCompany"
import { getInvoiceByCompanyApproved } from "./getInvoiceByCompanyApproved"

export async function invoiceRoutes(app: FastifyInstance) {
  app.post("/invoice/:clientId", register)
  app.put("/invoice/:invoiceId", update)
  app.delete("/invoice/:invoiceId", remove)
  app.get("/invoice/:invoiceId", getByInvoice)
  app.get("/invoices/user/:companyId", getInvoiceByCompany)
  app.get("/invoices/user/approved/:companyId", getInvoiceByCompanyApproved)
}
