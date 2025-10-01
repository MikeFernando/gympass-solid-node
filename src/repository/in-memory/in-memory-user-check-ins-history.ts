import { randomUUID } from "node:crypto"

import type { CheckIn, Prisma } from "@/generated/prisma"
import type { CheckInsRepository } from "../check-ins-repository"

export class InMemoryUserCheckInsHistoryRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async save(checkIn: CheckIn): Promise<CheckIn> {
    const index = this.items.findIndex(item => item.id === checkIn.id)
    this.items[index] = checkIn
    return checkIn
  }

  async findById(id: string): Promise<CheckIn | null> {
    const checkIn = this.items.find(item => item.id === id)
    return checkIn ?? null
  }

  async countByUserId(userId: string): Promise<number> {
    return this.items.filter(item => item.user_id === userId).length
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    return this.items
      .filter(item => item.user_id === userId)
      .slice((page - 1) * 20, page * 20)
  }

  async findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
    const checkIn = this.items.find(item => item.user_id === userId && item.created_at.toDateString() === date.toDateString())

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