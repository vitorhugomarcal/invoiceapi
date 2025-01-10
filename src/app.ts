import "@/utils/dayjsLocaleConfig"

import fastify, { type FastifyReply, type FastifyRequest } from "fastify"
import cors from "@fastify/cors"
import { fastifyJwt } from "@fastify/jwt"
import { fastifyCookie } from "@fastify/cookie"

import { userRoutes } from "./http/controller/user/routes"
import { ItensRoutes } from "./http/controller/Itens/routes"
import { UnitsRoutes } from "./http/controller/Units/routes"
import { clientRoutes } from "./http/controller/client/routes"
import { companyRoutes } from "./http/controller/company/routes"
import { invoiceRoutes } from "./http/controller/invoice/routes"
import { supplierRoutes } from "./http/controller/supplier/routes"
import { estimateRoutes } from "./http/controller/estimate/routes"
import { invoiceItemsRoutes } from "./http/controller/invoiceItems/routes"
import { estimateItemsRoutes } from "./http/controller/estimateItems/routes"

import { AppError } from "./utils/AppError"
import { authentication } from "./http/middlewares/authentication"
import { env } from "./env"

const ALLOWED_ORIGINS = "*"

export const app = fastify()

app.register(authentication)

const securityConfig = {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400, // 24 hours
  },
  jwt: {
    secret: env.JWT_SECRET,
    // cookie: {
    //   cookieName: "auth",
    //   signed: false,
    //   httpOnly: true,
    //   secure: env.NODE_ENV === "production",
    //   sameSite: "strict" as const,
    // },
    sign: {
      expiresIn: "10m",
    },
  },
}

app.register(cors, securityConfig.cors)
app.register(fastifyJwt, securityConfig.jwt)
// app.register(fastifyCookie)

app.register(userRoutes)
app.register(ItensRoutes)
app.register(UnitsRoutes)
app.register(clientRoutes)
app.register(invoiceRoutes)
app.register(companyRoutes)
app.register(estimateRoutes)
app.register(supplierRoutes)
app.register(invoiceItemsRoutes)
app.register(estimateItemsRoutes)

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
