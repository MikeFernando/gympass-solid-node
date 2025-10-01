import { InMemoryUserCheckInsHistoryRepository } from "@/repository/in-memory/in-memory-user-check-ins-history"
import { GetUserMetricsUseCase } from "./get-user-metrics"
import { describe, expect, it } from "vitest"

let inMemoryUserCheckInsHistoryRepository: InMemoryUserCheckInsHistoryRepository
let sut: GetUserMetricsUseCase

describe('Get User Metrics Use Case', () => {

  it('should be able to get check-ins count from metrics', async () => {
    inMemoryUserCheckInsHistoryRepository = new InMemoryUserCheckInsHistoryRepository()
    sut = new GetUserMetricsUseCase(inMemoryUserCheckInsHistoryRepository)

    await inMemoryUserCheckInsHistoryRepository.create({
      user_id: 'user-1',
      gym_id: 'gym-1',
      created_at: new Date(),
    })

    await inMemoryUserCheckInsHistoryRepository.create({
      user_id: 'user-1',
      gym_id: 'gym-2',
      created_at: new Date(),
    })

    const { checkInsCount } = await sut.execute({
      userId: 'user-1',
    })

    expect(checkInsCount).toBe(2)
  })
})