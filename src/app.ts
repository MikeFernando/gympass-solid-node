import Fastify from 'fastify'
import { PrismaClient } from './generated/prisma'

export const app = Fastify()

const prisma = new PrismaClient()

prisma.user.create({
  data: {
    name: 'Mike Fernando',
    email: 'mikefernando@gmail.com',
  },
})
