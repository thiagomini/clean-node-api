import { AccountModel } from '../../../../domain/models'
import { Optional } from '../../../../utils'

export interface LoadAccountByTokenRepository {
  load(token: string): Promise<Optional<AccountModel>>
}
