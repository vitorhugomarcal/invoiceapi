import { UsersRepository } from "@/repositories/users-repository"
import { User } from "@prisma/client"
import { ResourceNotFoundError } from "../errors/resource-not-fount-error"

interface UpdateUserRoleUseCaseRequest {
  userId: string
  role: "MASTER" | "BASIC"
}

interface UpdateUserRoleUseCaseResponse {
  user: User
}

export class UpdateUserRoleUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    role,
  }: UpdateUserRoleUseCaseRequest): Promise<UpdateUserRoleUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    user.role = role ?? user.role

    await this.usersRepository.update(user)

    return {
      user,
    }
  }
}
