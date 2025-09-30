import { describe, expect, it } from 'vitest'

import { RegisterUseCase } from './register'
import { InMemoryUsersRepository } from '../../repository/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'

describe('Register use case', () => {

  it('should be able to hash user password', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(inMemoryUsersRepository)

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare('123456', user.password_hash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })
})