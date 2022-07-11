import { ContextError, ContextErrorInput } from '../../../../errors'

export type EncryptionErrorInput = Pick<ContextErrorInput, 'cause'>

export class EncryptionError extends ContextError {
  constructor (errorInput: EncryptionErrorInput) {
    super({
      message: 'An Error occurred while encrypting password',
      errorName: EncryptionError.name,
      ...errorInput
    })
  }
}
