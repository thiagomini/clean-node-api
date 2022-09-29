import { ContextError, ContextErrorInput } from '@/errors'

export interface EncryptionErrorInput
  extends Omit<ContextErrorInput, 'message'> {
  sourceValue: string
}

export class EncryptionError extends ContextError {
  constructor(errorInput: EncryptionErrorInput) {
    super({
      ...errorInput,
      message: `An error occurred while encrypting the value ${errorInput.sourceValue}`,
      errorName: EncryptionError.name,
    })
  }
}
