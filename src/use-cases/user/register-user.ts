import { UsersRepository } from "@/repositories/users-repository"
import { User } from "@prisma/client"

interface RegisterUserUseCaseRequest {
  name: string
  email: string
}

interface RegisterUserUseCaseResponse {
  User: User
}

export class RegisterUserUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    name,
    email,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const User = await this.userRepository.create({
      name,
      email,
    })

    return { User }
  }
}
