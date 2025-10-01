import { prisma } from '../../lib/prisma'
import { Prisma, type User } from '../../generated/prisma'

import type { UsersRepository } from '@/repository/users-repository'

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }

  async create(user: Prisma.UserCreateInput) {
    const createdUser = await prisma.user.create({
      data: user,
    })

    return createdUser
  }
}
