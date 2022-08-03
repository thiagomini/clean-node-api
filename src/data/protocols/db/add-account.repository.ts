import { AccountModel } from '../../../domain/models'
import { AddAccountInput } from '../../../domain/use-cases/add-account'

export interface AddAccountRepository {
  add: (addAcAccountInput: AddAccountInput) => Promise<AccountModel>
}
