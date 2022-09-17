import {
  AccountModel,
  Decrypter,
  LoadAccountByTokenRepository,
  Optional,
  LoadAccountByTokenUseCase,
  AccountByTokenNotFoundError,
  InvalidTokenError,
  LoadAccountByTokenUseCaseError,
} from './db-load-account-by-token.protocols'

export class DbLoadAccountByTokenUseCase implements LoadAccountByTokenUseCase {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load(
    accessToken: string,
    role?: string
  ): Promise<Optional<AccountModel>> {
    try {
      return await this.decryptTokenAndGetAccount(accessToken, role)
    } catch (error) {
      return this.handleError(error as Error, accessToken)
    }
  }

  private async decryptTokenAndGetAccount(
    accessToken: string,
    role?: string
  ): Promise<AccountModel> {
    await this.decrypter.decrypt(accessToken)
    return await this.loadAccountByTokenRepository.loadByToken(
      accessToken,
      role
    )
  }

  private handleError(error: Error, accessToken: string): never | undefined {
    if (error instanceof InvalidTokenError) {
      return undefined
    }

    if (error instanceof AccountByTokenNotFoundError) {
      return undefined
    }

    throw new LoadAccountByTokenUseCaseError({
      cause: error as Error,
      accessToken,
    })
  }
}
