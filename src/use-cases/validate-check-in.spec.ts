import { describe, expect, it } from "vitest";

import { InMemoryCheckInsRepository } from "@/repository/in-memory/in-memory-check-ins-repository"
import { ValidateCheckInUseCase } from "./validade-check-in"
import { ResourceNotFoundError } from "./erros/resource-not-found-error"

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check In Use Case', () => {

  it('should be able to validate check-in', async () => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(inMemoryCheckInsRepository)

    const createdCheckIn = await inMemoryCheckInsRepository.create({
      user_id: 'user-1',
      gym_id: 'gym-1',
      created_at: new Date(),
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate an inexistent check-in', async () => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(inMemoryCheckInsRepository)

    await expect(sut.execute({
      checkInId: 'check-in-1',
    })).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})