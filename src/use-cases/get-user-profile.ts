import type { User } from '@/generated/prisma'

import type { UsersRepository } from '@/repository/users-repository'
import { ResourceNotFoundError } from './erros/resource-not-found-error'


interface GetUserProfileUseCaseRequest {
  id: string
}

type GetUserProfileUseCaseResponse = {
  user: User
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute({ id }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(id)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return { user }
  }
}