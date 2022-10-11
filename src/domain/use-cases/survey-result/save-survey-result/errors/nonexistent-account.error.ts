import { ContextError, ContextErrorInput } from '@/errors'

export interface NonexistentAccountErrorInput
  extends Omit<ContextErrorInput, 'message' | 'errorName'> {
  accountId: string
}

export class NonexistentAccountError extends ContextError {
  constructor(errorInput: NonexistentAccountErrorInput) {
    super({
      ...errorInput,
      message: `Account with id ${errorInput.accountId} does not exist`,
      errorName: NonexistentAccountError.name,
    })
  }
}
