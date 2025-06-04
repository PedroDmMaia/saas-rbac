import { roleSchema } from '@saas/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'

export async function getMemberShip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/org/:slug/membership',
    {
      schema: {
        tags: ['organizations'],
        summary: 'Get user membership on organization',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
        }),
        response: {
          200: z.object({
            membership: z.object({
              id: z.string().uuid(),
              role: z.string(),
              organizationId: z.string().uuid(),
            }),
          }),
        },
      },
    },
    async (request) => {
      const { slug } = request.params
      const { membership } = await request.getUserMemberShip(slug)

      return {
        membership: {
          id: membership.id,
          role: roleSchema.parse(membership.role),
          organizationId: membership.organizationId,
        },
      }
    },
  )
}
