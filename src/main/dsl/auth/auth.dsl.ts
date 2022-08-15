import { DbAddAccountUseCase } from '../../../data/use-cases/add-account/db-add-account.use-case'
import { AccountModel } from '../../../domain/models'
import { AddAccountInput, AddAccountUseCase } from '../../../domain/use-cases/add-account'
import { BCryptHasherAdapter } from '../../../infra/cryptography/bcrypt-hasher.adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account-mongo.repository'

export class AuthDSL {
  constructor (private readonly addAccountUseCase: AddAccountUseCase) {}

  async signupUser (signupUserInput: AddAccountInput): Promise<AccountModel> {
    return await this.addAccountUseCase.add(signupUserInput)
  }

  public static create (): AuthDSL {
    const encrypter = new BCryptHasherAdapter()
    const addAccountRepository = new AccountMongoRepository()

    return new AuthDSL(new DbAddAccountUseCase(encrypter, addAccountRepository))
  }
}
