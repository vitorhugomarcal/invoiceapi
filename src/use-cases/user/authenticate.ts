import { UsersRepository } from "@/repositories/users-repository"
import { User } from "@prisma/client"
import { InvalidCredentialsError } from "../errors/invalid-credentials-error"

interface AuthenticateUseCaseRequest {
  email: string
}

interface AuthenticateUseCaseResponse {
  user: User
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    return {
      user,
    }
  }
}
