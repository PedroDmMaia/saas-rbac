import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { env } from '@saas/env'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { authenticateWithGithub } from '@/http/routes/auth/authenticate-with-github'
import { AuthenticateWithPasswordAuth } from '@/http/routes/auth/authenticate-with-password.auth'
import { getProfile } from '@/http/routes/auth/get-profile.auth'
import { requestPasswordRecover } from '@/http/routes/auth/request-password-recover'
import { resetPassword } from '@/http/routes/auth/reset-password'

import { auth } from './middlewares/auth'
import { createAccount } from './routes/auth/create-account.auth'
import { createOrganization } from './routes/orgs/create-organization'
import { getMemberShip } from './routes/orgs/get-membership'
import { getOrganization } from './routes/orgs/get-organization'
import { getOrganizations } from './routes/orgs/get-organizations'
import { updateOrganization } from './routes/orgs/update-organization'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors)

app.register(fastifySwagger, {
  swagger: {
    info: {
      title: 'Nexts Saas',
      description: 'Full-stack Saas app with multi-tenant & RBAC.',
      version: '1.0.0',
    },
    securityDefinitions: {
      authorization: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: 'JWT obtained from authentication route.',
      },
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(createAccount)
app.register(AuthenticateWithPasswordAuth)
app.register(authenticateWithGithub)
app.register(getProfile)
app.register(requestPasswordRecover)
app.register(resetPassword)

app.register(auth)

app.register(createOrganization)
app.register(getMemberShip)
app.register(getOrganization)
app.register(getOrganizations)
app.register(updateOrganization)

app.listen({ port: env.SERVER_PORT }).then(() => {
  console.log('HTTP server running 🚀')
})
