import Fastify from 'fastify'
import { PrismaClient } from './generated/prisma'

export const app = Fastify()

const prisma = new PrismaClient()

prisma.user.create({
  data: {
    name: 'Mike Fernando',
    email: 'mikefernando@gmail.com',
    password_hash: 'hashed_password_here',
  },
})
