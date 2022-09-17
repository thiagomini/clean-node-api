import {
  AccountModel,
  Decrypter,
  LoadAccountByTokenRepository,
  Optional,
} from '../add-account/db-add-account.protocols'
import { LoadAccountByTokenUseCase } from '../authentication/db-authentication-protocols'
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
      const tokenOrUdefined = await this.decrypter.decrypt(accessToken)
      if (!tokenOrUdefined) {
        return undefined
      }

      return await this.loadAccountByTokenRepository.loadByToken(accessToken)
    } catch (error) {
      throw new LoadAccountByTokenUseCaseError({
        cause: error as Error,
        accessToken,
      })
    }
  }
}
