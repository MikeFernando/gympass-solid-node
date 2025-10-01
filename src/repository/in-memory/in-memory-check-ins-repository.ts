import { randomUUID } from 'node:crypto'

import type { CheckIn, Prisma } from '../../generated/prisma'
import type { CheckInsRepository } from '../check-ins-repository'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
    const checkIn = this.items
      .find(item => item.user_id === userId && item.created_at
        .toDateString() === date
          .toDateString())

    if (!checkIn) {
      return null
    }
    return checkIn
  }

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn: CheckIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      created_at: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
    }

    this.items.push(checkIn)

    return checkIn
  }
}
