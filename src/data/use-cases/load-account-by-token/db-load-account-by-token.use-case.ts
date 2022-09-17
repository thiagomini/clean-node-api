import {
  AccountModel,
  Decrypter,
  Optional,
} from '../add-account/db-add-account.protocols'
import { LoadAccountByTokenUseCase } from '../authentication/db-authentication-protocols'
import { LoadAccountByTokenUseCaseError } from './load-account-by-token.use-case.error'

export class DbLoadAccountByTokenUseCase implements LoadAccountByTokenUseCase {
  constructor(private readonly decrypter: Decrypter) {}
  async load(
    accessToken: string,
    role?: string | undefined
  ): Promise<Optional<AccountModel>> {
    try {
      await this.decrypter.decrypt(accessToken)
      return undefined
    } catch (error) {
      throw new LoadAccountByTokenUseCaseError({
        cause: error as Error,
        accessToken,
      })
    }
  }
}
