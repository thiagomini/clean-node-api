import { AccountModel } from '../../../domain/models'
import { AddAccountInput, AddAccountUseCase } from '../../../domain/use-cases/add-account'
import { Hasher } from '../../protocols/cryptography'
import { AddAccountRepository } from '../../protocols/db/add-account.repository'
import { AddAccountUseCaseError } from './errors'

export class DbAddAccountUseCase implements AddAccountUseCase {
  constructor (private readonly hasher: Hasher, private readonly addAccountRepository: AddAccountRepository) {}

  async add (account: AddAccountInput): Promise<AccountModel> {
    try {
      return await this.saveAccount(account)
    } catch (error) {
      throw new AddAccountUseCaseError({
        cause: error as Error,
        context: account
      })
    }
  }

  private async saveAccount (account: AddAccountInput): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(account.password)
    return await this.addAccountRepository.add({
      ...account,
      password: hashedPassword
    })
  }
}
