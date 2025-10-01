import { describe, expect, it } from "vitest"

import { InMemoryUserCheckInsHistoryRepository } from "@/repository/in-memory/in-memory-user-check-ins-history"
import { FetchUserCheckInsHistoryUseCase } from "./fetch-user-check-ins-history"

let inMemoryUserCheckInsHistoryRepository: InMemoryUserCheckInsHistoryRepository
let sut: FetchUserCheckInsHistoryUseCase

describe('Fetch User Check Ins History Use Case', () => {

  it('should be able to fetch user check ins history', async () => {
    inMemoryUserCheckInsHistoryRepository = new InMemoryUserCheckInsHistoryRepository()
    sut = new FetchUserCheckInsHistoryUseCase(inMemoryUserCheckInsHistoryRepository)

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

    const { checkIns } = await sut.execute({
      userId: 'user-1',
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toContainEqual(expect.objectContaining({
      user_id: 'user-1',
      gym_id: 'gym-1',
    }))
    expect(checkIns).toContainEqual(expect.objectContaining({
      user_id: 'user-1',
      gym_id: 'gym-2',
    }))
  })

  it('should be able to fetch paginated check-in history', async () => {
    inMemoryUserCheckInsHistoryRepository = new InMemoryUserCheckInsHistoryRepository()
    sut = new FetchUserCheckInsHistoryUseCase(inMemoryUserCheckInsHistoryRepository)

    // Todas as listas de dados precisam estar paginadas com 20 itens por página;
    for (let i = 0; i < 22; i++) {
      await inMemoryUserCheckInsHistoryRepository.create({
        user_id: 'user-1',
        gym_id: `gym-${i}`,
        created_at: new Date(),
      })
    }

    const { checkIns } = await sut.execute({
      userId: 'user-1',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toContainEqual(expect.objectContaining({
      gym_id: 'gym-20',
    }))
    expect(checkIns).toContainEqual(expect.objectContaining({
      gym_id: 'gym-21',
    }))
  })
})