import { AccountModel } from '../../../../domain/models'
import { Optional } from '../../../../utils'

export interface LoadAccountByTokenRepository {
  loadByToken(token: string): Promise<Optional<AccountModel>>
}
