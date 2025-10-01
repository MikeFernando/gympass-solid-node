import { randomUUID } from 'node:crypto'

import type { Gym, Prisma } from '@/generated/prisma/client'

import type { GymsRepository } from '../gym-repository'
import { Decimal } from '@prisma/client/runtime/binary'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

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