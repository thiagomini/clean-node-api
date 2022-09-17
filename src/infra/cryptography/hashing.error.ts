import { ContextError, ContextErrorInput } from '../../errors'

export type EncryptionErrorInput = Omit<
  ContextErrorInput,
  'message' | 'errorName'
>

export class HashingError extends ContextError {
  constructor(errorInput: EncryptionErrorInput) {
    super({
      ...errorInput,
      message: 'An error occurred while trying to hash the value',
      errorName: HashingError.name,
    })
  }
}
