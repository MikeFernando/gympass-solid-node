import { beforeEach, describe, expect, it } from "vitest"

import { CheckInUseCase } from "./check-in"
import { InMemoryCheckInsRepository } from "../repository/in-memory/in-memory-check-ins-repository"

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('Check in use case', () => {

  beforeEach(() => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(inMemoryCheckInsRepository)
  })

  it('should be able to check in', async () => {
    const checkIn = await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
    })

    expect(checkIn.checkIn.id).toEqual(expect.any(String))
  })
})