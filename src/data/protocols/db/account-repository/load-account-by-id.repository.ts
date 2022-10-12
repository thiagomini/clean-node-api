import { Optional } from '@/utils'
import { AccountModel } from '@/domain/models'

export interface LoadAccountByIdRepository {
  loadById(id: string): Promise<Optional<AccountModel>>
}
