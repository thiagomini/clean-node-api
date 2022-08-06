import { AccountModel } from '../../../domain/models'
import { Optional } from '../../../utils'

export interface LoadAccountByEmailRepository {
  load(email: string): Promise<Optional<AccountModel>>
}
