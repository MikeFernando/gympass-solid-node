import { hash } from 'bcryptjs'

import type { UsersRepository } from '../repository/users-repositoru'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

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
