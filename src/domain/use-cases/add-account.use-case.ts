import { AccountModel } from '../models'
import { AddAccountInput } from './add-account.input'

export interface AddAccountUseCase {
  add: (account: AddAccountInput) => AccountModel
}
