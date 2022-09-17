import { ContextError, ContextErrorInput } from '../../errors'

export interface EmailValidationErrorInput
  extends Pick<ContextErrorInput, 'cause' | 'context'> {
  email: string
}

export class EmailValidationError extends ContextError {
  constructor(errorInput: EmailValidationErrorInput) {
    super({
      message: `EmailValidation failed to validate email: ${errorInput.email}`,
      cause: errorInput.cause,
      context: errorInput.context,
      errorName: EmailValidationError.name,
    })
  }
}
