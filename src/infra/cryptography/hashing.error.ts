import { ContextError, ContextErrorInput } from '@/errors'

export type HashingErrorInput = Omit<ContextErrorInput, 'message' | 'errorName'>

export class HashingError extends ContextError {
  constructor(errorInput: HashingErrorInput) {
    super({
      ...errorInput,
      message: 'An error occurred while trying to hash the value',
      errorName: HashingError.name,
    })
  }
}
