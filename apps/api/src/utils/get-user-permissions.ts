import { defineAbilityFor, Role, userSchema } from '@saas/auth'

export function getUSerPermissions(userId: string, role: Role) {
  const authUser = userSchema.parse({
    id: userId,
    role,
  })

  const ability = defineAbilityFor(authUser)

  return ability
}
