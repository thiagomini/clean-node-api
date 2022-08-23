import { AccountModel } from '../../../domain/models'
import { AddAccountInput, AddAccountOutput, AddAccountUseCase } from '../../../domain/use-cases/add-account'
import { Hasher } from '../../protocols/cryptography'
import { LoadAccountByEmailRepository } from '../../protocols/db/account-repository'
import { AddAccountRepository } from '../../protocols/db/account-repository/add-account.repository'
import { AddAccountUseCaseError } from './errors'

export class DbAddAccountUseCase implements AddAccountUseCase {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
    ) {}

  async findOrCreate (account: AddAccountInput): Promise<AddAccountOutput> {
    try {
      return await this.findOrSaveAccount(account)
    } catch (error) {
      throw new AddAccountUseCaseError({
        cause: error as Error,
        context: account
      })
    }
  }

  private async findOrSaveAccount (account: AddAccountInput): Promise<AddAccountOutput> {
    const existingAccount = await this.loadAccountByEmailRepository.loadByEmail(account.email)
    if (existingAccount) {
      return {
        ...existingAccount,
        isNew: false,
      }
    }
    const hashedPassword = await this.hasher.hash(account.password)
    const newAccount = await this.addAccountRepository.add({
      ...account,
      password: hashedPassword
    })
    return {
      ...newAccount,
      isNew: true
    }
  }
}
