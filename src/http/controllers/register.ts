import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { registerUseCase } from '@/use-cases/register'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const requestBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
  })

  const { name, email, password } = requestBodySchema.parse(request.body)

  try {
    await registerUseCase({ name, email, password })
  } catch (error) {
    return reply.status(409).send()
  }

  return reply.status(201).send()
}
