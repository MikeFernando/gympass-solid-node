import dayjs from "dayjs"

import { prisma } from "../../lib/prisma"

import type { CheckIn, Prisma } from "@/generated/prisma"
import type { CheckInsRepository } from "../check-ins-repository"

export class PrismaCheckInsRepository implements CheckInsRepository {

  async save(checkIn: CheckIn) {
    const updatedCheckIn = await prisma.checkIn.update({
      where: { id: checkIn.id },
      data: checkIn,
    })
    return updatedCheckIn
  }

  async findById(id: string) {
    const checkIn = await prisma.checkIn.findUnique({
      where: { id },
    })
    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('day').toDate()
    const endOfTheDay = dayjs(date).endOf('day').toDate()

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: { gte: startOfTheDay, lte: endOfTheDay }
      },
    })
    return checkIn
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = await prisma.checkIn.findMany({
      where: { user_id: userId },
      skip: (page - 1) * 20,
      take: 20,
    })
    return checkIns
  }

  async countByUserId(userId: string) {
    const count = await prisma.checkIn.count({
      where: { user_id: userId },
    })
    return count
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({
      data,
    })
    return checkIn
  }
}