import { env } from "./env"
import "@/utils/dayjsLocaleConfig"

import fastify from "fastify"
import cors from "@fastify/cors"
import { fastifyJwt } from "@fastify/jwt"

import { userRoutes } from "./http/controller/user/routes"
import { fastifyCookie } from "@fastify/cookie"
import { AppError } from "./utils/AppError"
import { companyRoutes } from "./http/controller/company/routes"
import { clientRoutes } from "./http/controller/client/routes"
import { invoiceItemsRoutes } from "./http/controller/invoiceItems/routes"
import { invoiceRoutes } from "./http/controller/invoice/routes"
import { ItensRoutes } from "./http/controller/Itens/routes"
import { UnitsRoutes } from "./http/controller/Units/routes"

export const app = fastify()

app.register(cors, {
  origin: ["http://localhost:3333", "http://192.168.1.142:3333"], // specify allowed origins
  methods: ["GET", "POST", "PUT", "DELETE"], // specify allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // specify allowed headers
  credentials: true, // include credentials such as cookies in requests
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
  sign: {
    expiresIn: "30d",
  },
})

app.register(fastifyCookie)

app.register(userRoutes)
app.register(ItensRoutes)
app.register(UnitsRoutes)
app.register(clientRoutes)
app.register(companyRoutes)
app.register(invoiceRoutes)
app.register(invoiceItemsRoutes)

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof AppError) {
    return reply.status(400).send({ message: error.message })
  }

  if (env.NODE_ENV !== "production") {
    console.error(error)
  } else {
    // TODO: here we should log to an external tool like DataDog/NewRelic.Sentry
  }

  return reply.status(500).send({ message: "Internal server error." })
})
