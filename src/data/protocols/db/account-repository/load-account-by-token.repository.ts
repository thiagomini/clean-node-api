import { Role } from '../../../../auth'
import { AccountModel } from '../../../../domain/models'
import { Optional } from '../../../../utils'

export interface LoadAccountByTokenRepository {
  loadByToken(token: string, role?: Role): Promise<AccountModel>
}
