import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"
import { GetUserProfileEmailUseCase } from "../user/get-user-profile-email"

export function makeGetUserProfileEmailUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new GetUserProfileEmailUseCase(usersRepository)

  return useCase
}
