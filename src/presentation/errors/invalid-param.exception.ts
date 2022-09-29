import { ContextError } from '@/errors'

export class InvalidParamException extends ContextError {
  constructor(paramName: string) {
    super({
      message: `Invalid parameter: ${paramName}`,
      errorName: InvalidParamException.name,
    })
  }
}
