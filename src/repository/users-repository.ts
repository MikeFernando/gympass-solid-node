import type { User } from '@/generated/prisma/client'
import type { Prisma } from '@/generated/prisma'

export interface UsersRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(data: Prisma.UserCreateInput): Promise<User>
}
