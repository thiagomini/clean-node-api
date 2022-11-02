import { AddAccountInput } from '@/data/use-cases/account/add-account/db-add-account.protocols'
import { faker } from '@faker-js/faker'
import { Role } from '../../../auth'

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
