import { AccountModel } from '../../../domain/models'
import { AddAccountInput, AddAccountUseCase } from '../../../domain/use-cases/add-account'
import { Encrypter } from '../../protocols'
import { AddAccountRepository } from '../../protocols/add-account.repository'
import { EncryptionError } from './errors'

export class DbAddAccountUseCase implements AddAccountUseCase {
  constructor (private readonly encrypter: Encrypter, private readonly addAccountRepository: AddAccountRepository) {}

  async add (account: AddAccountInput): Promise<AccountModel> {
    let hashedPassword: string

    try {
      hashedPassword = await this.encrypter.encrypt(account.password)
    } catch (error) {
      throw new EncryptionError({
        cause: error as Error
      })
    }

    await this.addAccountRepository.add({
      ...account,
      password: hashedPassword
    })

    return {
      ...account,
      id: '1'
    }
  }
}
