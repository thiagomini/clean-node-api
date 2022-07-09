import { ContextError } from '../../errors'

export class ServerError extends ContextError {
  constructor (cause: Error) {
    super({
      message: 'Something unexpected happened',
      errorName: ServerError.name,
      cause
    })
  }
}
