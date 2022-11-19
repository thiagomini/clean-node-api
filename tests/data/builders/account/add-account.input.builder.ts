import { AddAccountInput } from '@/domain/use-cases/account/add-account'
import { faker } from '@faker-js/faker'
import { Role } from '@/auth'

export function buildAccountInput(
  partial: Partial<AddAccountInput> = {}
): AddAccountInput {
  const defaultAttributes: AddAccountInput = {
    name: faker.name.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: Role.User,
  }

  return Object.assign(defaultAttributes, partial)
}
