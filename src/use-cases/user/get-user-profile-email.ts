import { UsersRepository } from "@/repositories/users-repository"
import { User } from "@prisma/client"

interface GetUserProfileEmailUseCaseRequest {
  email: string
}

interface GetUserProfileEmailUseCaseResponse {
  user: User | {}
}

export class GetUserProfileEmailUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
  }: GetUserProfileEmailUseCaseRequest): Promise<GetUserProfileEmailUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    return {
      user: user || {},
    }
  }
}
