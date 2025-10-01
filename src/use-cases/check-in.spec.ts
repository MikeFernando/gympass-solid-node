import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { CheckInUseCase } from "./check-in"
import { InMemoryCheckInsRepository } from "../repository/in-memory/in-memory-check-ins-repository"
import { MaxNumberOfCheckInsError } from "./erros/max-number-of-check-ins-error"
import { InMemoryGymsRepository } from "../repository/in-memory/in-memory-gyms-repository"
import { MaxDistanceError } from "./erros/max-distance-error"

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let inMemoryGymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check in use case', () => {

  beforeEach(async () => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    inMemoryGymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(inMemoryCheckInsRepository, inMemoryGymsRepository)

    vi.useFakeTimers()

    await inMemoryGymsRepository.create({
      id: 'gym-1',
      title: 'Gym 1',
      description: 'Gym 1 description',
      phone: '1234567890',
      latitude: -24.5090436,
      longitude: -48.8463689,
    })
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
      userLatitude: -24.5090436,
      userLongitude: -48.8463689,
    })

    expect(checkIn.checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2025, 0, 1, 10, 0, 0))

    await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: -24.5090436,
      userLongitude: -48.8463689,
    })

    await expect(sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: -24.5090436,
      userLongitude: -48.8463689,
    })).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should  be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2025, 0, 1, 10, 0, 0))

    await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: -24.5090436,
      userLongitude: -48.8463689,
    })

    vi.setSystemTime(new Date(2025, 0, 2, 8, 0, 0))

    await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: -24.5090436,
      userLongitude: -48.8463689,
    })
  })

  it('should not be able to check in on distant gym', async () => {
    await expect(sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: -24.5100436, // Approximately 200m away from gym
      userLongitude: -48.8473689,
    })).rejects.toBeInstanceOf(MaxDistanceError)
  })
})