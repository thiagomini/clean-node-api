import { Role } from '@/auth'
import { AccountModel } from '@/domain/models'

export interface LoadAccountByTokenRepository {
  loadByToken(token: string, role?: Role): Promise<AccountModel>
}
