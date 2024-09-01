import { FastifyInstance } from "fastify"
import { register } from "./register"
import { getByInvoice } from "./getByInvoice"
import { deleteItem } from "./deleteItem"
import { getByUser } from "./getByUser"
import { update } from "./update"
import { updateInvoiceItems } from "./updateInvoiceItems"

export async function ItensRoutes(app: FastifyInstance) {
  app.post("/items/:userId", register)
  app.get("/items/:userId", getByInvoice)
  app.get("/items/user/:userId", getByUser)
  app.delete("/items/:itemId", deleteItem)
  app.put("/items/:itemId", update)
  app.put("/items/invoice/:itemId", updateInvoiceItems)
}
