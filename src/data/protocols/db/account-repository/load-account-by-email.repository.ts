import { AccountModel } from '@/domain/models'
import { Optional } from '@/utils'

export interface LoadAccountByEmailRepository {
  loadByEmail(email: string): Promise<Optional<AccountModel>>
}
