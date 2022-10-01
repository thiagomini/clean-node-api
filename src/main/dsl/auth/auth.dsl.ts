import { buildAccountInput } from '@/data/test-data-builders'
import {
  AddAccountOutput,
  AddAccountUseCase,
} from '@/domain/use-cases/add-account'
import { Authentication } from '@/domain/use-cases/authentication'
import { AccountModel } from '@/domain/models'
import { createDbAddAccount, createDbAuthentication } from '../../factories'

export interface SignupUserInput extends Partial<Omit<AccountModel, 'id'>> {}

export class AuthDSL {
  constructor(
    private readonly addAccountUseCase: AddAccountUseCase,
    private readonly authentication: Authentication
  ) {}

  async signupUser(
    signupUserInput?: SignupUserInput
  ): Promise<AddAccountOutput> {
    const finalInput = buildAccountInput(signupUserInput)

    const newAccount = await this.addAccountUseCase.findOrCreate(finalInput)

    newAccount.accessToken = await this.authentication.authenticate({
      email: newAccount.email,
      password: finalInput.password,
    })

    return newAccount
  }

  public static create(): AuthDSL {
    return new AuthDSL(createDbAddAccount(), createDbAuthentication())
  }
}
