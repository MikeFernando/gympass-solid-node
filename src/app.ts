import Fastify from 'fastify'

import { appRoutes } from './http/routes.js'

export const app = Fastify()

app.register(appRoutes)
