import {
  AccountModel,
  Decrypter,
  LoadAccountByTokenRepository,
  Optional,
} from '../add-account/db-add-account.protocols'
import { LoadAccountByTokenUseCase } from '../authentication/db-authentication-protocols'
import { InvalidTokenError } from './invalid-token.error'
import { LoadAccountByTokenUseCaseError } from './load-account-by-token.use-case.error'

export class DbLoadAccountByTokenUseCase implements LoadAccountByTokenUseCase {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load(
    accessToken: string,
    role?: string | undefined
  ): Promise<Optional<AccountModel>> {
    try {
      await this.decrypter.decrypt(accessToken)
      return await this.loadAccountByTokenRepository.loadByToken(
        accessToken,
        role
      )
    } catch (error) {
      if (error instanceof InvalidTokenError) {
        return undefined
      }

      throw new LoadAccountByTokenUseCaseError({
        cause: error as Error,
        accessToken,
      })
    }
  }
}
