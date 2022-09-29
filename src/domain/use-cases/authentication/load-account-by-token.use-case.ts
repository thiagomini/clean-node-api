import { Role } from '@/auth'
import { Optional } from '@/utils'
import { AccountModel } from '../../models'

export interface LoadAccountByTokenUseCase {
  load(accessToken: string, role?: Role): Promise<Optional<AccountModel>>
}
