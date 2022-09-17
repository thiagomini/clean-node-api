import { AccountModel } from '../../../../domain/models'
import { Optional } from '../../../../utils'

export interface LoadAccountByTokenRepository {
  loadByToken(token: string, role?: string): Promise<Optional<AccountModel>>
}
