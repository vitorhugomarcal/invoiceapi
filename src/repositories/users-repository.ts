import { Prisma, User } from "@prisma/client"

export interface UsersRepository {
  findAll(): Promise<User[]>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  remove(id: string): Promise<void>
  update(data: Prisma.UserCreateInput): Promise<User>
  create(data: Prisma.UserCreateInput): Promise<User>
  save(data: Prisma.UserCreateInput): Promise<User>
}
