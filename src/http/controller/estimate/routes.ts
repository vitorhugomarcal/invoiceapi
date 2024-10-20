import { FastifyInstance } from "fastify"

import { update } from "./update"
import { remove } from "./remove"
import { register } from "./register"
import { getByEstimate } from "./getByEstimate"
import { getEstimateBySupplier } from "./getEstimateBySupplier"
import { getAllByCompany } from "./getAllByCompany"

export async function estimateRoutes(app: FastifyInstance) {
  app.post("/estimate/:supplierId/:companyId", register)

  app.get("/estimate/:estimateId", getByEstimate)
  app.get("/estimates/supplier/:supplierId/:companyId", getEstimateBySupplier)
  app.get("/estimates/:companyId", getAllByCompany)

  app.put("/estimate/:estimateId", update)

  app.delete("/estimate/:estimateId", remove)
}
