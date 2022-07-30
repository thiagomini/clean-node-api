import { Optional } from '../../utils'
import { Validation } from './validation'
import { ValidationError } from './validation.error'

export class ValidationComposite implements Validation {
  constructor (private readonly validations: Validation[]) {}
  validate (input: unknown): Optional<Error> {
    try {
      for (const validation of this.validations) {
        const errorOrUndefined = validation.validate(input)
        if (errorOrUndefined) {
          return errorOrUndefined
        }
      }
    } catch (error) {
      throw new ValidationError({
        cause: error as Error,
        context: {
          input
        }
      })
    }
  }
}
