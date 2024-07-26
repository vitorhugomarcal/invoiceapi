import { env } from "./env"
import fastify from "fastify"
import { fastifyJwt } from "@fastify/jwt"

import { userRoutes } from "./http/controller/user/routes"
import { fastifyCookie } from "@fastify/cookie"
import { AppError } from "./utils/AppError"
import { companyRoutes } from "./http/controller/company/routes"
import { clientRoutes } from "./http/controller/client/routes"

export const app = fastify()

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
app.register(companyRoutes)
app.register(clientRoutes)

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
