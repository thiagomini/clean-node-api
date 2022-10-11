import {
  AddAccountInput,
  AddAccountUseCaseError,
  Hasher,
  AddAccountRepository,
  LoadAccountByEmailRepository,
  AddAccountOutput,
  AddAccountUseCase,
  Optional,
} from './db-add-account.protocols'

export class DbAddAccountUseCase implements AddAccountUseCase {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async findOrCreate(account: AddAccountInput): Promise<AddAccountOutput> {
    try {
      return await this.findOrSaveAccount(account)
    } catch (error) {
      throw new AddAccountUseCaseError({
        cause: error as Error,
        context: account,
      })
    }
  }

  private async findOrSaveAccount(
    account: AddAccountInput
  ): Promise<AddAccountOutput> {
    const existingAccount = await this.tryFindAccountByEmail(account.email)
    if (existingAccount) {
      return existingAccount
    }

    return await this.saveNewAccount(account)
  }

  private async tryFindAccountByEmail(
    email: string
  ): Promise<Optional<AddAccountOutput>> {
    const existingAccount = await this.loadAccountByEmailRepository.loadByEmail(
      email
    )
    if (existingAccount) {
      return {
        ...existingAccount,
        isNew: false,
      }
    }
  }

  async saveNewAccount(account: AddAccountInput): Promise<AddAccountOutput> {
    const hashedPassword = await this.hasher.hash(account.password)
    const newAccount = await this.addAccountRepository.add({
      ...account,
      password: hashedPassword,
    })

    return {
      ...newAccount,
      isNew: true,
    }
  }
}
