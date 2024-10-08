import { FastifyInstance } from "fastify"
import { register } from "./register"
import { getByEstimate } from "./getByEstimate"
import { deleteItemByEstimate } from "./deleteItemByEstimate"
import { updateEstimateItems } from "./updateEstimateItems"

export async function estimateItemsRoutes(app: FastifyInstance) {
  app.post("/estimate/items/:estimateId", register)
  app.get("/estimate/items/:estimateId", getByEstimate)
  app.delete("/estimate/items/:itemId", deleteItemByEstimate)
  app.put("/items/estimate/:itemEstimateId", updateEstimateItems)
}
