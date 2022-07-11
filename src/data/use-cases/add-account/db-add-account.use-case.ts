import { AccountModel } from '../../../domain/models'
import { AddAccountInput, AddAccountUseCase } from '../../../domain/use-cases/add-account'
import { Encrypter } from '../../protocols'
import { EncryptionError } from './errors'

export class DbAddAccountUseCase implements AddAccountUseCase {
  constructor (private readonly encrypter: Encrypter) {}

  async add (account: AddAccountInput): Promise<AccountModel> {
    try {
      await this.encrypter.encrypt(account.password)
    } catch (error) {
      throw new EncryptionError({
        cause: error as Error
      })
    }

    return {
      ...account,
      id: '1'
    }
  }
}
