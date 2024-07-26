import { UsersRepository } from "@/repositories/users-repository"
import { User } from "@prisma/client"
import { ResourceNotFoundError } from "../errors/resource-not-fount-error"

interface UpdateUserUseCaseRequest {
  userId: string
  name?: string | null
  role?: "MASTER" | "BASIC"
}

interface UpdateUserUseCaseResponse {
  user: User
}

export class UpdateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    name,
    role,
  }: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    user.name = name ?? user.name

    user.role = role ?? user.role

    await this.usersRepository.save(user)

    return {
      user,
    }
  }
}
