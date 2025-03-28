import { AbilityBuilder } from '@casl/ability'

import { AppAbility } from './index.ts'
import { User } from './models/user.ts'
import { Role } from './roles.ts'

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void

export const permissions: Record<Role, PermissionsByRole> = {
  ADMIN(user, { can, cannot }) {
    can('manage', 'all')

    cannot(['transfer_ownership', 'update'], 'Organization')
    cannot(['transfer_ownership', 'update'], 'Organization', {
      ownerId: { $eq: user.id },
    })
  },
  MEMBER(user, { can }) {
    can(['get'], 'User')
    can(['create', 'get'], 'Project')
    can(['delete', 'update'], 'Project', { ownerId: { $eq: user.id } })
  },
  BILLING(_, { can }) {
    can('manage', 'Billing')
  },
}
