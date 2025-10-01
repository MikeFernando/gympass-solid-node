import type { CheckInsRepository } from '@/repository/check-ins-repository'
import type { CheckIn } from '@/generated/prisma'

import { MaxNumberOfCheckInsError } from './erros/max-number-of-check-ins-error'
import { ResourceNotFoundError } from './erros/resource-not-found-error'
import type { GymsRepository } from '@/repository/gym-repository'

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

type CheckInUseCaseResponse = {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository
  ) { }

  async execute({ userId, gymId }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    // O usuário não pode fazer check-in se não estiver perto (100m) da academia;

    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(userId, new Date())

    if (checkInOnSameDate) {
      throw new MaxNumberOfCheckInsError()
    }

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return { checkIn }
  }
}