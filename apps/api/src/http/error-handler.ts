import * as console from 'node:console'

import { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'

import { BadRequestError } from '@/http/routes/_errors/bad-request.error'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized.error'

type fastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: fastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      errors: error.flatten().fieldErrors,
    })
  }

  if (error instanceof BadRequestError) {
    return reply.status(400).send({
      message: error.message,
    })
  }

  if (error instanceof UnauthorizedError) {
    return reply.status(400).send({
      message: error.message,
    })
  }

  console.error(error)

  // send error to some observability plataform

  return reply.status(500).send({ message: 'Internal server error.' })
}
