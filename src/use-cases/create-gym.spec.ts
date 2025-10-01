import { describe, expect, it } from "vitest"

import { CreateGymUseCase } from "./create-gym"
import { InMemoryGymsRepository } from "@/repository/in-memory/in-memory-gyms-repository"

let inMemoryGymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  it('should be able to create a gym', async () => {
    inMemoryGymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(inMemoryGymsRepository)

    const { gym } = await sut.execute({
      title: 'Gym 1',
      description: 'Gym 1 description',
      phone: '1234567890',
      latitude: -24.5090436,
      longitude: -48.8463689,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})