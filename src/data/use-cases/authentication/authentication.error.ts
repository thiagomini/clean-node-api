import { ContextError, ContextErrorInput } from '@/errors'

export interface AuthenticationErrorInput
  extends Pick<ContextErrorInput, 'cause' | 'context'> {
  email: string
}

export class AuthenticationError extends ContextError {
  constructor(errorInput: AuthenticationErrorInput) {
    super({
      message: `An Error occurred while trying to authenticate with email ${errorInput.email}`,
      errorName: AuthenticationError.name,
      ...errorInput,
    })
  }
}
