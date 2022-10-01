import { ContextError } from '../../errors'

export class ExistingEmailException extends ContextError {
  constructor(email: string) {
    super({
      message: `The received email ${email} is already in use`,
      errorName: ExistingEmailException.name,
      context: {
        email,
      },
    })
  }
}
