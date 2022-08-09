import { ContextError, ContextErrorInput } from '../../errors'

export type HashComparisonErrorInput = Omit<ContextErrorInput, 'message' | 'errorName'>

export class HashComparisonError extends ContextError {
  constructor (errorInput: HashComparisonErrorInput) {
    super({
      ...errorInput,
      message: 'An error occurred while trying to compare a value with its hash ',
      errorName: HashComparisonError.name
    })
  }
}
