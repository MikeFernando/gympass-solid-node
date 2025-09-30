import { prisma } from '../lib/prisma'
import { Prisma } from '../generated/prisma'

export class PrismaUsersRepository {
  async create(user: Prisma.UserCreateInput) {
    const createdUser = await prisma.user.create({
      data: user,
    })

    return createdUser
  }
}
