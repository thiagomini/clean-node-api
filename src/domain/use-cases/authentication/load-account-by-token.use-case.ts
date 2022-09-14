import { AccountModel } from '../../models'

export interface LoadAccountByTokenUseCase {
  load(accessToken: string, role?: string): Promise<AccountModel>
}
