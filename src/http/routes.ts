import type { FastifyInstance } from 'fastify'

import { profile } from './controllers/profile.js'
import { register } from './controllers/register.js'
import { authenticate } from './controllers/authenticate.js'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)
  app.get('/me', profile)
}
