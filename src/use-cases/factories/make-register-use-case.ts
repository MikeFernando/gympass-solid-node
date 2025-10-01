import { RegisterUseCase } from '../register'
import { PrismaUsersRepository } from '@/repository/prisma/prisma-users-repository'

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const registerUseCase = new RegisterUseCase(usersRepository)

  return registerUseCase
}