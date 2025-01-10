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

// const ALLOWED_ORIGINS = process.env.NODE_ENV === 'production'
//   ? ['https://yourapp.com', 'https://api.yourapp.com']
//   : ['http://localhost:3000']

const ALLOWED_ORIGINS = "*"

export const app = fastify({
  logger: {
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
  },
})

const securityConfig = {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400, // 24 hours
  },
  jwt: {
    secret: process.env.JWT_SECRET || "",
    cookie: {
      cookieName: "refreshToken",
      signed: false,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
    },
    sign: {
      expiresIn: "10m",
    },
  },
}

async function registerPlugins() {
  await app.register(cors, securityConfig.cors)
  await app.register(fastifyJwt, securityConfig.jwt)
  await app.register(fastifyCookie)
  await app.register(authentication)
}

async function registerRoutes() {
  const routes = [
    userRoutes,
    ItensRoutes,
    UnitsRoutes,
    clientRoutes,
    invoiceRoutes,
    companyRoutes,
    estimateRoutes,
    supplierRoutes,
    invoiceItemsRoutes,
    estimateItemsRoutes,
  ]

  for (const route of routes) {
    await app.register(route)
  }
}

app.setErrorHandler((error, request, reply) => {
  const statusCode = error instanceof AppError ? 400 : 500
  const message =
    error instanceof AppError ? error.message : "Internal server error."

  // Log errors appropriately based on environment
  if (process.env.NODE_ENV !== "production") {
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      path: request.url,
      method: request.method,
    })
  } else {
    // Production error logging
    // TODO: Implement proper error logging service
    const errorLog = {
      timestamp: new Date().toISOString(),
      error: error.message,
      path: request.url,
      method: request.method,
      statusCode,
    }
    console.error(JSON.stringify(errorLog))
  }

  return reply.status(statusCode).send({ message })
})

// Initialize application
async function initializeApp() {
  try {
    await registerPlugins()
    await registerRoutes()

    // Add graceful shutdown handling
    const signals = ["SIGTERM", "SIGINT"]
    signals.forEach((signal) => {
      process.on(signal, async () => {
        console.log(`Received ${signal}, starting graceful shutdown...`)
        await app.close()
        process.exit(0)
      })
    })
  } catch (error) {
    console.error("Failed to initialize application:", error)
    process.exit(1)
  }
}

initializeApp()

export default app
