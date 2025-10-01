import { InMemoryGymsRepository } from "@/repository/in-memory/in-memory-gyms-repository"
import { SearchGymUseCase } from "./search-gym"
import { describe, expect, it } from "vitest"

let inMemoryGymsRepository: InMemoryGymsRepository
let sut: SearchGymUseCase

describe('Search Gym Use Case', () => {

  it('should be able to search for gyms', async () => {
    inMemoryGymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymUseCase(inMemoryGymsRepository)

    await inMemoryGymsRepository.create({
      title: 'JavaScript Gym',
      description: 'JavaScript Gym description',
      phone: '1234567890',
      latitude: -24.5090436,
      longitude: -48.8463689,
    })

    await inMemoryGymsRepository.create({
      title: 'TypeScript Gym',
      description: 'TypeScript Gym description',
      phone: '1234567890',
      latitude: -24.5090436,
      longitude: -48.8463689,
    })

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toContainEqual(expect.objectContaining({ title: 'JavaScript Gym' }))
  })

  it('should be able to search for paginated gyms', async () => {
    inMemoryGymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymUseCase(inMemoryGymsRepository)

    for (let i = 0; i < 22; i++) {
      await inMemoryGymsRepository.create({
        title: `Gym ${i}`,
        description: `Gym ${i} description`,
        phone: '1234567890',
        latitude: -24.5090436,
        longitude: -48.8463689,
      })
    }

    const { gyms } = await sut.execute({
      query: 'Gym',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toContainEqual(expect.objectContaining({ title: 'Gym 20' }))
    expect(gyms).toContainEqual(expect.objectContaining({ title: 'Gym 21' }))
  })
})