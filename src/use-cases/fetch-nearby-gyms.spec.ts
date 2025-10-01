import { describe, expect, it } from "vitest"

import { InMemoryGymsRepository } from "@/repository/in-memory/in-memory-gyms-repository"
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms"

let inMemoryGymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {

  it('should be able to fetch nearby gyms', async () => {
    inMemoryGymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(inMemoryGymsRepository)

    await inMemoryGymsRepository.create({
      title: 'Near Gym 1',
      description: 'Near Gym description',
      phone: '1234567890',
      latitude: -24.5123301,
      longitude: -48.8464566,
    })

    await inMemoryGymsRepository.create({
      title: 'Far Gym',
      description: 'Far Gym description',
      phone: '1234567890',
      latitude: -24.4551819,
      longitude: -48.7209886,
    })

    const { gyms } = await sut.execute({
      userLatitude: -24.5146476,
      userLongitude: -48.8543959,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toContainEqual(expect.objectContaining({ title: 'Near Gym 1' }))
  })
})