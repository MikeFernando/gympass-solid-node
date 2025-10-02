import { SearchGymUseCase } from '../search-gym'
import { PrismaGymsRepository } from '@/repository/prisma/prisma-gyms-repository'

export function makeSearchGymUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const searchGymUseCase = new SearchGymUseCase(gymsRepository)

  return searchGymUseCase
}
