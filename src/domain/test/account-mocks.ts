import { Role } from '@/auth'
import { AccountModel } from '@/domain/models'
import {
  AddAccountInput,
  AddAccountOutput,
  AddAccountUseCase,
} from '@/domain/use-cases/account/add-account'
import { AuthenticationInput } from '@/domain/use-cases/authentication'

export const fakeAccount = (): AccountModel => ({
  id: 'valid_id',
  email: 'valid_email@mail.com',
  name: 'valid_name',
  password: 'hashed_password',
  role: Role.User,
})

export const fakeAccountInput = (): AddAccountInput => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password',
  role: Role.User,
})

export const fakeAddAccountOutput = (): AddAccountOutput => ({
  id: 'valid_id',
  email: 'valid_email@mail.com',
  name: 'valid_name',
  password: 'hashed_password',
  isNew: true,
  role: Role.User,
})

export const fakeAuthenticationInput = (): AuthenticationInput => ({
  email: 'any_mail@mail.com',
  password: 'any_password',
})

export const createAddAccountUseCaseStub = (): AddAccountUseCase => {
  class AddAccountStub implements AddAccountUseCase {
    async findOrCreate(): Promise<AddAccountOutput> {
      return {
        ...fakeAccount(),
        isNew: true,
      }
    }
  }
  return new AddAccountStub()
}
