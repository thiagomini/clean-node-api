import { AccountModel } from '../../../domain/models'
import { AddAccountInput, AddAccountUseCase } from '../../../domain/use-cases/add-account'
import { Encrypter } from '../../protocols'

export class DbAddAccountUseCase implements AddAccountUseCase {
  constructor (private readonly encrypter: Encrypter) {}

  async add (account: AddAccountInput): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)

    return {
      ...account,
      id: '1'
    }
  }
}
