import { ContextError } from '../../errors'

export class MissingParamException extends ContextError {
  constructor(paramName: string) {
    super({
      message: `Missing parameter: ${paramName}`,
      errorName: MissingParamException.name,
    })
  }
}
