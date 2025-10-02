import type { CheckIn } from "@/generated/prisma"

import type { CheckInsRepository } from "@/repository/check-ins-repository"
import { ResourceNotFoundError } from "./erros/resource-not-found-error"
import { LateCheckInValidationError } from "./erros/late-check-in-validation-error"

interface ValidateCheckInUseCaseRequest {
  checkInId: string
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) { }

  async execute({ checkInId }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    const distanceInMinutesFromCheckInCreation = Math.abs(
      new Date().getTime() - checkIn.created_at.getTime()
    ) / (1000 * 60)

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError()
    }

    checkIn.validated_at = new Date()

    await this.checkInsRepository.save(checkIn)

    return { checkIn }
  }
}