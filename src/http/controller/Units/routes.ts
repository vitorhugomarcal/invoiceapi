import { FastifyInstance } from "fastify"
import { register } from "./register"
import { getAll } from "./getAll"
import { registerByUser } from "./registerByUser"
import { remove } from "./remove"

export async function UnitsRoutes(app: FastifyInstance) {
  app.post("/units", register)
  app.post("/units/:userId", registerByUser)
  app.get("/units/:userId", getAll)
  app.delete("/units/:unitId", remove)
}
