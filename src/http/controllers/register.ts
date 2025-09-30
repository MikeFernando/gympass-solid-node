import type { FastifyReply, FastifyRequest } from 'fastify'
import { hash } from 'bcryptjs'
import { z } from 'zod'

import { prisma } from 'lib/prisma'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const requestBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
  })

  const { name, email, password } = requestBodySchema.parse(request.body)

  const password_hash = await hash(password, 6)

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userWithSameEmail) {
    return reply.status(409).send()
  }

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password_hash,
      },
    })

    return reply.status(201).send()
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return reply.status(409).send()
    }

    throw error
  }
}
