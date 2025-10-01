import { Decimal } from '@prisma/client/runtime/binary'
import { randomUUID } from 'node:crypto'

import type { Gym, Prisma } from '@/generated/prisma/client'

import type { FindManyNearbyParams, GymsRepository } from '../gym-repository'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
    return this.items
      .filter(item => {
        const distance = getDistanceBetweenCoordinates(
          { latitude: params.userLatitude, longitude: params.userLongitude },
          { latitude: item.latitude.toNumber(), longitude: item.longitude.toNumber() }
        )
        return distance < 10 // 10km
      })

  }

  async search(query: string, page: number): Promise<Gym[]> {
    return this.items
      .filter(item => item.title.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  async findById(id: string): Promise<Gym | null> {
    const gym = this.items.find(item => item.id === id)

    if (!gym) {
      return null
    }

    return gym
  }

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym: Gym = {
      id: data.id || randomUUID(),
      title: data.title,
      description: data.description || '',
      phone: data.phone || '',
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
    }

    this.items.push(gym)

    return gym
  }
}