import { ContextError, ContextErrorInput } from '../../errors'

export type EncryptionErrorInput = Omit<ContextErrorInput, 'message' | 'errorName'>

export class EncryptionError extends ContextError {
  constructor (errorInput: EncryptionErrorInput) {
    super({
      ...errorInput,
      message: 'An error occurred while encrypting the value',
      errorName: EncryptionError.name
    })
  }
}
