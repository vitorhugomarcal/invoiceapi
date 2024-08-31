import { FastifyInstance } from "fastify"
import { register } from "./register"
import { getByInvoice } from "./getByInvoice"
import { deleteItemByInvoice } from "./deleteItemByInvoice"

export async function invoiceItemsRoutes(app: FastifyInstance) {
  app.post("/invoice/items/:invoiceId", register)
  app.get("/invoice/items/:invoiceId", getByInvoice)
  app.delete("/invoice/items/:itemId", deleteItemByInvoice)
}
