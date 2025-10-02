import type { Gym, Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

import type { FindManyNearbyParams, GymsRepository } from "../gym-repository";

export class PrismaGymsRepository implements GymsRepository {

  async findManyNearby(params: FindManyNearbyParams) {
    // Busca academias em até 10km da localização do usuário 
    // usando a fórmula de Haversine (distância geográfica entre dois pontos).
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${params.userLatitude}) ) * cos( radians( latitude ) ) * cos(
      radians( longitude ) - radians(${params.userLongitude}) ) + sin( radians(${params.userLatitude}) ) * sin(
      radians( latitude ) ) ) ) <= 10
    `

    return gyms

  }

  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: { id },
    })

    return gym
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({
      data,
    })

    return gym
  }

  async search(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        title: { contains: query },
      },
      skip: (page - 1) * 20,
      take: 20,
    })

    return gyms
  }

}