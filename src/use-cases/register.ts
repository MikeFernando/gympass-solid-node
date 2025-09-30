import { prisma } from '../lib/prisma'
import { hash } from 'bcryptjs'

import { PrismaUsersRepository } from '@/repository/prisma-users-repository'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private usersRepository: PrismaUsersRepository) { }

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmail) {
      throw new Error('E-mail already exists')
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    return user
  }
}
