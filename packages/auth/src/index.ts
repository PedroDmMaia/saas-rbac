import {
  AbilityBuilder,
  CreateAbility,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability'
import { z } from 'zod'

import { User } from './models/user.ts'
import { permissions } from './permissions.ts'
import { billingSubject } from './subjects/billing.ts'
import { inviteSubject } from './subjects/invite.ts'
import { organizationSubject } from './subjects/organization.ts'
import { projectSubject } from './subjects/project.ts'
import { userSubject } from './subjects/user.ts'

export * from './models/user.ts'
export * from './models/project.ts'
export * from './models/organization.ts'
export * from './roles'

const AppAbilitiesSchema = z.union([
  projectSubject,
  userSubject,
  inviteSubject,
  organizationSubject,
  billingSubject,

  z.tuple([z.literal('manage'), z.literal('all')]),
])

type AppAbilities = z.infer<typeof AppAbilitiesSchema>

export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility)

  if (typeof permissions[user.role] !== 'function') {
    throw new Error(`permissions for role ${user.role} not found`)
  }

  permissions[user.role](user, builder)

  return builder.build({
    detectSubjectType(subject) {
      return subject.__typename
    },
  })
}
