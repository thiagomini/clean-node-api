import { AccountModel } from '../../../models'

export interface AddAccountInput
  extends Pick<AccountModel, 'name' | 'email' | 'password'> {}
