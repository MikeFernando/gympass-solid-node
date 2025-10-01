import type { Gym } from "@/generated/prisma"
import type { GymsRepository } from "@/repository/gym-repository"

interface SearchGymUseCaseRequest {
  query: string
  page: number
}

interface SearchGymUseCaseResponse {
  gyms: Gym[]
}

export class SearchGymUseCase {
  constructor(private gymsRepository: GymsRepository) { }

  async execute({ query, page }: SearchGymUseCaseRequest): Promise<SearchGymUseCaseResponse> {
    const gyms = await this.gymsRepository.search(query, page)

    return { gyms }
  }
}