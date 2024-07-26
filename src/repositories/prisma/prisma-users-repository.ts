import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { UsersRepository } from "../users-repository"

export class PrismaUsersRepository implements UsersRepository {
  async update(data: Prisma.UserCreateInput) {
    const user = await prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    })

    return user
  }

  async findAll() {
    const users = await prisma.user.findMany()
    return users
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    return user
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    return user
  }

  async remove(id: string) {
    // await prisma.exercisesByUser.deleteMany({
    //   where: {
    //     user_id: id,
    //   },
    // })
    // await prisma.history.deleteMany({
    //   where: {
    //     user_id: id,
    //   },
    // })
    // await prisma.anamnese.deleteMany({
    //   where: {
    //     user_id: id,
    //   },
    // })
    // await prisma.avaliacao.deleteMany({
    //   where: {
    //     user_id: id,
    //   },
    // })
    // await prisma.message.deleteMany({
    //   where: {
    //     member_id: id,
    //   },
    // })
    // await prisma.user.delete({
    //   where: {
    //     id,
    //   },
    // })
  }

  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }

  async save(data: Prisma.UserCreateInput) {
    const user = await prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    })

    return user
  }
}
