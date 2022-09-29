import { AddAccountInput } from '@/data/use-cases/add-account/db-add-account.protocols'
import { faker } from '@faker-js/faker'

export function buildAccountInput(
  partial: Partial<AddAccountInput> = {}
): AddAccountInput {
  const defaultAttributes: AddAccountInput = {
    name: faker.name.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  }

  return Object.assign(defaultAttributes, partial)
}
