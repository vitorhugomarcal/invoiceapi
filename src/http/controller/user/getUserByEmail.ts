import { makeGetUserProfileEmailUseCase } from "@/use-cases/factories/make-user-profile-email-use-case"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function getUserByEmail(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const idExerciseParamsSchema = z.object({
    email: z.string(),
  })

  const { email } = idExerciseParamsSchema.parse(request.params)

  const getUserProfile = makeGetUserProfileEmailUseCase()

  const { user } = await getUserProfile.execute({ email })

  return reply.status(200).send(user || {})
}
