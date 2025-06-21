import { organizationSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { getUSerPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_errors/bad-request.error'
import { UnauthorizedError } from '../_errors/unauthorized.error'

export async function updateOrganization(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/organizations/:slug',
    {
      schema: {
        tags: ['Organizations'],
        summary: 'Update organization details',
        security: [{ bearerAuth: [] }],
        body: z.object({
          name: z.string(),
          domain: z.string().nullish(),
          shouldAttachUsersByDomain: z.boolean().optional(),
        }),
        params: z.object({
          slug: z.string(),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request) => {
      const { slug } = request.params

      const userId = await request.getCurrentUserId()
      const { membership, organization } = await request.getUserMemberShip(slug)

      const { name, domain, shouldAttachUsersByDomain } = request.body

      const authOrganization = organizationSchema.parse(organization)

      const { cannot } = getUSerPermissions(userId, membership.role)

      if (cannot('update', authOrganization)) {
        throw new UnauthorizedError(
          `You're not allowed to update this organization.`,
        )
      }

      if (domain) {
        const organizationByDomain = await prisma.organization.findFirst({
          where: {
            domain,
            id: {
              not: organization.id,
            },
          },
        })

        if (organizationByDomain) {
          throw new BadRequestError(
            'Another organization with same domain already exists.',
          )
        }
      }

      await prisma.organization.update({
        where: {
          id: organization.id,
        },
        data: {
          name,
          domain,
          shouldAttachUsersByDomain,
        },
      })
    },
  )
}
