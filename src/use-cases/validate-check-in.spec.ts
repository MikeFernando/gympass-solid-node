import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { InMemoryCheckInsRepository } from "@/repository/in-memory/in-memory-check-ins-repository"
import { ValidateCheckInUseCase } from "./validate-check-in"
import { ResourceNotFoundError } from "./erros/resource-not-found-error"
import { LateCheckInValidationError } from "./erros/late-check-in-validation-error"

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check In Use Case', () => {

  beforeEach(async () => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(inMemoryCheckInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate check-in', async () => {
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
    await expect(sut.execute({
      checkInId: 'check-in-1',
    })).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    const createdCheckIn = await inMemoryCheckInsRepository.create({
      user_id: 'user-1',
      gym_id: 'gym-1',
      created_at: new Date(),
    })

    vi.advanceTimersByTime(21 * 60 * 1000) // 21 minutes

    await expect(sut.execute({
      checkInId: createdCheckIn.id,
    })).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})