import { Resend } from "resend"
import { z } from "zod"
import { FastifyReply, FastifyRequest } from "fastify"
import { prisma } from "@/lib/prisma"
import { createId } from "@paralleldrive/cuid2"

// Validation schemas
const envSchema = z.object({
  RESEND_API: z.string().min(1, "Resend API key is required"),
  JWT_SECRET: z.string().min(32, "JWT secret must be at least 32 characters"),
  API_BASE_URL: z.string().url("Invalid API base URL"),
  AUTH_REDIRECT_URL: z.string().url("Invalid redirect URL"),
})

const emailSchema = z.object({
  email: z.string().email("Invalid email format").toLowerCase().trim(),
})

// Custom error handling
class AuthError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number
  ) {
    super(message)
    this.name = "AuthError"
  }
}

// Environment configuration
const env = envSchema.parse({
  RESEND_API: process.env.RESEND_API,
  JWT_SECRET: process.env.JWT_SECRET,
  API_BASE_URL: process.env.API_BASE_URL || "http://192.168.1.145:5173",
  AUTH_REDIRECT_URL:
    process.env.AUTH_REDIRECT_URL || "http://192.168.1.145:5173",
})

const resend = new Resend(env.RESEND_API)

const MAGIC_LINK_EXPIRATION = 15 * 60 * 1000 // 15 minutes in milliseconds

async function createMagicLinkEmail(
  email: string,
  magicLink: URL
): Promise<void> {
  await resend.emails.send({
    from: "no-reply@update.ipsec.com.br",
    to: email,
    subject: "Seu link de acesso",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Seu link de acesso</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">Seu link de acesso</h1>
            <p>Olá! Você solicitou um link de acesso para sua conta.</p>
            <p>Clique no botão abaixo para acessar sua conta:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${magicLink}" 
                 style="background-color: #2563eb; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 4px; display: inline-block;">
                Acessar conta
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">
              Este link expira em 15 minutos por motivos de segurança.
              Se você não solicitou este link, por favor ignore este email.
            </p>
            <hr style="border: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              Este é um email automático. Por favor não responda.
            </p>
          </div>
        </body>
      </html>
    `,
  })
}

export async function createMagicAuth(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { email } = emailSchema.parse(request.body)

    // const recentAttempt = await prisma.authLinks.findFirst({
    //   where: {
    //     userId: { email },
    //     createdAt: {
    //       gte: new Date(Date.now() - 60000), // 1 minute ago
    //     },
    //   },
    // })

    // if (recentAttempt) {
    //   throw new AuthError(
    //     "Por favor aguarde um minuto antes de solicitar um novo link",
    //     "RATE_LIMITED",
    //     429
    //   )
    // }

    // Find or throw error
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new AuthError("Email não encontrado", "USER_NOT_FOUND", 404)
    }

    // Clean up expired auth links
    await prisma.authLinks.deleteMany({
      where: {
        userId: user.id,
        createdAt: {
          lt: new Date(Date.now() - MAGIC_LINK_EXPIRATION),
        },
      },
    })

    // Create new auth link
    const authLinkCode = createId()
    await prisma.authLinks.create({
      data: {
        userId: user.id,
        code: authLinkCode,
        expiresAt: new Date(Date.now() + MAGIC_LINK_EXPIRATION),
      },
    })

    // Generate magic link
    const magicLink = new URL("/auth/magic-link", env.API_BASE_URL)
    magicLink.searchParams.set("code", authLinkCode)
    magicLink.searchParams.set("redirect", env.AUTH_REDIRECT_URL)

    // Send email
    await createMagicLinkEmail(email, magicLink)

    // Log success (implement proper logging in production)
    console.info(`Magic link sent successfully to ${email}`)

    return reply.status(200).send({
      message: "Link de acesso enviado com sucesso! Verifique seu email.",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        code: "VALIDATION_ERROR",
        message: "Dados inválidos",
        details: error.errors,
      })
    }

    if (error instanceof AuthError) {
      return reply.status(error.statusCode).send({
        code: error.code,
        message: error.message,
      })
    }

    // Log error (implement proper error logging in production)
    console.error("Magic link error:", error)

    return reply.status(500).send({
      code: "INTERNAL_ERROR",
      message:
        "Erro interno do servidor. Por favor tente novamente mais tarde.",
    })
  }
}
