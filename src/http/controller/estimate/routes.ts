import { FastifyInstance } from "fastify"

import { update } from "./update"
import { remove } from "./remove"
import { register } from "./register"
import { getByEstimate } from "./getByEstimate"
import { getEstimateBySupplier } from "./getEstimateBySupplier"

export async function estimateRoutes(app: FastifyInstance) {
  app.post("/estimate/:supplierId/:userId", register)
  app.put("/estimate/:estimateId", update)
  app.delete("/estimate/:estimateId", remove)
  app.get("/estimate/:estimateId", getByEstimate)
  app.get("/estimates/supplier/:supplierId/:userId", getEstimateBySupplier)
}
