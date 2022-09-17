import {
  AccountModel,
  Decrypter,
  Optional,
} from '../add-account/db-add-account.protocols'
import { LoadAccountByTokenUseCase } from '../authentication/db-authentication-protocols'

export class DbLoadAccountByTokenUseCase implements LoadAccountByTokenUseCase {
  constructor(private readonly decrypter: Decrypter) {}
  async load(
    accessToken: string,
    role?: string | undefined
  ): Promise<Optional<AccountModel>> {
    this.decrypter.decrypt(accessToken)
    return undefined
  }
}
