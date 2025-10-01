import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { CheckInUseCase } from "./check-in"
import { InMemoryCheckInsRepository } from "../repository/in-memory/in-memory-check-ins-repository"
import { MaxNumberOfCheckInsError } from "./erros/max-number-of-check-ins-error"

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('Check in use case', () => {

  beforeEach(() => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(inMemoryCheckInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should be able to check in', async () => {
    const checkIn = await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
    })

    expect(checkIn.checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2025, 0, 1, 10, 0, 0))

    await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
    })

    await expect(sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
    })).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should  be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2025, 0, 1, 10, 0, 0))

    await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
    })

    vi.setSystemTime(new Date(2025, 0, 2, 8, 0, 0))

    await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
    })
  })
})