import { ContextError, ContextErrorInput } from '../../errors'

export interface ValidationErrorInput extends Pick<ContextErrorInput, 'cause' | 'context'> {
}

export class ValidationError extends ContextError {
  constructor (errorInput: ValidationErrorInput) {
    super({
      message: 'Validation chain failed',
      cause: errorInput.cause,
      context: errorInput.context,
      errorName: ValidationError.name
    })
  }
}
