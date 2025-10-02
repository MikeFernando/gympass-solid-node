import { FetchNearbyGymsUseCase } from '../fetch-nearby-gyms'
import { PrismaGymsRepository } from '@/repository/prisma/prisma-gyms-repository'

export function makeFetchNearbyGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const fetchNearbyGymsUseCase = new FetchNearbyGymsUseCase(gymsRepository)

  return fetchNearbyGymsUseCase
}
