import type { Gym, Prisma } from '@/generated/prisma/client'

export interface FindManyNearbyParams {
  userLatitude: number
  userLongitude: number
}

export interface GymsRepository {
  findManyNearby(params: FindManyNearbyParams): Promise<Gym[]>
  findById(id: string): Promise<Gym | null>
  create(data: Prisma.GymCreateInput): Promise<Gym>
  search(query: string, page: number): Promise<Gym[]>
}
