import { ContextError, ContextErrorInput } from '../../errors'

export interface NotFoundErrorInput extends Pick<ContextErrorInput, 'cause'> {
  entityName: string
  missingId: string
}

export class NotFoundError extends ContextError {
  constructor(errorInput: NotFoundErrorInput) {
    super({
      message: `Could not find ${errorInput.entityName} with id ${errorInput.missingId}`,
      errorName: NotFoundError.name,
      cause: errorInput.cause,
    })
  }
}
