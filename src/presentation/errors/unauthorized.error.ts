import { ContextError } from '../../errors'

export class UnauthorizedError extends ContextError {
  constructor () {
    super({
      message: 'Unauthorized access requested',
      errorName: UnauthorizedError.name
    })
  }
}
