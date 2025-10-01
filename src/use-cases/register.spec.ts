import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { RegisterUseCase } from './register'
import { UserAlreadyExistsError } from './erros/user-already-exists-error'
import { InMemoryUsersRepository } from '../repository/in-memory/in-memory-users-repository'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register use case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(inMemoryUsersRepository)
  })

  it('should be able to hash user password', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare('123456', user.password_hash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'john.doe@example.com'

    await sut.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })

    await expect(sut.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    expect(user.id).toBeDefined()
    expect(user.name).toBe('John Doe')
    expect(user.email).toBe('john.doe@example.com')
    expect(user.password_hash).toBeDefined()
    expect(user.created_at).toBeDefined()
  })
})