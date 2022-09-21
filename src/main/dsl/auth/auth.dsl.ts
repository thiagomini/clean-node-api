import { buildAccountInput } from '../../../data/test-data-builders'
import {
  AddAccountInput,
  AddAccountOutput,
  AddAccountUseCase,
} from '../../../domain/use-cases/add-account'
import { Authentication } from '../../../domain/use-cases/authentication'
import { createDbAddAccount, createDbAuthentication } from '../../factories'

export class AuthDSL {
  constructor(
    private readonly addAccountUseCase: AddAccountUseCase,
    private readonly authentication: Authentication
  ) {}

  async signupUser(
    signupUserInput?: AddAccountInput
  ): Promise<AddAccountOutput> {
    if (!signupUserInput) {
      signupUserInput = buildAccountInput()
    }
    const newAccount = await this.addAccountUseCase.findOrCreate(
      signupUserInput
    )

    newAccount.accessToken = await this.authentication.authenticate({
      email: newAccount.email,
      password: signupUserInput.password,
    })

    return newAccount
  }

  public static create(): AuthDSL {
    return new AuthDSL(createDbAddAccount(), createDbAuthentication())
  }
}
