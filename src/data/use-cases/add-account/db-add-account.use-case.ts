import { AccountModel } from '../../../domain/models'
import { AddAccountInput, AddAccountUseCase } from '../../../domain/use-cases/add-account'
import { Encrypter } from '../../protocols'
import { AddAccountRepository } from '../../protocols/add-account.repository'
import { AddAccountUseCaseError } from './errors'

export class DbAddAccountUseCase implements AddAccountUseCase {
  constructor (private readonly encrypter: Encrypter, private readonly addAccountRepository: AddAccountRepository) {}

  async add (account: AddAccountInput): Promise<AccountModel> {
    try {
      const hashedPassword = await this.encrypter.encrypt(account.password)
      await this.addAccountRepository.add({
        ...account,
        password: hashedPassword
      })

      return {
        ...account,
        id: '1'
      }
    } catch (error) {
      throw new AddAccountUseCaseError({
        cause: error as Error
      })
    }
  }
}
