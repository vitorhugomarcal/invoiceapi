import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"
import { UpdateUserRoleUseCase } from "../user/update-role-user"

export function makeUpdateRoleUserUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new UpdateUserRoleUseCase(usersRepository)

  return useCase
}
