import { AddAccountInput } from './add-account.input'
import { AddAccountOutput } from './add-account.output'

export interface AddAccountUseCase {
  findOrCreate(account: AddAccountInput): Promise<AddAccountOutput>
}
